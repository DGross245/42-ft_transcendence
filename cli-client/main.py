import requests
import socketio
import logging
import asyncio
import threading
import json
import curses
import time
from pynput.keyboard import Key, Listener

import os, sys

# -------------------------------------------------------------------------- #
#                               Data Structure                               #
# -------------------------------------------------------------------------- #

# colors
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

# logging.basicConfig(level=logging.INFO)
# logging.basicConfig(level=logging.DEBUG)
# logging.basicConfig(level=logging.ERROR)

player_data = {
	'name': 'CLI-KEK',
	'color': 0x00ff00,
	'number': 1 # client number
}

# -------------------------------------------------------------------------- #
#                                  Globals                                   #
# -------------------------------------------------------------------------- #

game_id = "0"
paddle_length = 5

g_game_width = 500
g_game_height = 500
g_scaling_factor_width = 1
g_scaling_factor_height = 1

g_game_state = {}

# -------------------------------------------------------------------------- #
#                                   Utils                                    #
# -------------------------------------------------------------------------- #

def server_y_to_cli_y(server_y):
	return (int(server_y * g_scaling_factor_height))

def server_x_to_cli_x(server_x):
	return (int(server_x * g_scaling_factor_width))

def server_paddle_y_to_cli_paddle_y(server_paddle_y, cli_paddle_length):
	cli_paddle_y = []
	i = cli_paddle_length // 2 * -1
	while i <= cli_paddle_length // 2:
		cli_paddle_y.append(server_y_to_cli_y(server_paddle_y) + curses.LINES // 2 + i)
		i += 1
	return cli_paddle_y

def init_game_state():
	game_state = {
		'ball': {
			'x': 0,
			'y': 0
		},
		'left_paddle': {
			'x': 10,
			'y': [
				curses.LINES // 2 - 2,
				curses.LINES // 2 - 1,
				curses.LINES // 2,
				curses.LINES // 2 + 1,
				curses.LINES // 2 + 2
			]
		},
		'right_paddle': {
			'x': curses.COLS - 10,
			'y': [
				curses.LINES // 2 - 2,
				curses.LINES // 2 - 1,
				curses.LINES // 2,
				curses.LINES // 2 + 1,
				curses.LINES // 2 + 2
			]
		}
	}
	return game_state

def init_scaling_factors():
	global g_scaling_factor_height
	global g_scaling_factor_width
	g_scaling_factor_height = curses.LINES / g_game_height
	g_scaling_factor_width = curses.COLS / g_game_width

# -------------------------------------------------------------------------- #
#                                Socket Setup                                #
# -------------------------------------------------------------------------- #

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

async def socket_initialize():
	# makes server initialize socket
	requests.get('http://localhost:3000/api/socket')
	await sio.connect('http://localhost:3000')
	logging.info(YELLOW + f'socket initialized' + RESET)

async def start_socketio():
	try:
		await socket_initialize()
		await join_game(game_id, 'Pong', False)
		await sio.wait()
	except asyncio.CancelledError:
		logging.info(YELLOW + "Asyncio task was cancelled" + RESET)
	finally:
		await sio.disconnect()
		logging.info(YELLOW + "Disconnected" + RESET)

# -------------------------------------------------------------------------- #
#                              Message Handler                               #
# -------------------------------------------------------------------------- #

# @sio.on(f'message-{game_id}-PlayerData-{game_id}')
# async def receive_player_data(msg: str):
# 	logging.info(RED + f'Opponent data: {msg}' + RESET)
# 	exit

# @sio.on(f'message-{game_id}-Players-{game_id}')
# async def room_full(msg: str):
# 	logging.info(RED + f'Room full: {msg}' + RESET)
# 	exit

@sio.on(f'room-joined-{game_id}')
async def room_joined(num_clients: int):
	logging.info(RED + f'Room joined, number of clients: {num_clients}' + RESET)

@sio.on(f'message-{game_id}-paddleUpdate-{game_id}')
async def receive_paddle_data(msg: str):
	paddle_y = json.loads(msg)
	logging.info(RED + f'Received Paddle Data: {paddle_y}' + RESET)
	global g_game_state
	g_game_state['left_paddle']['y'] = server_paddle_y_to_cli_paddle_y(int(paddle_y), paddle_length)

@sio.on(f'message-{game_id}-ballUpdate-{game_id}')
async def receive_ball_data(msg: str):
	ball = json.loads(msg)
	ball_pos = ball['position']
	logging.info(RED + f'Received Ball Data: {ball_pos}' + RESET)
	new_ball = {
		'x': server_x_to_cli_x(ball_pos['x']) + curses.COLS // 2,
		'y': server_y_to_cli_y(ball_pos['z']) + curses.LINES // 2
	}
	global g_game_state
	g_game_state['ball']['x'] = int(new_ball['x'])
	g_game_state['ball']['y'] = int(new_ball['y'])

# -------------------------------------------------------------------------- #
#                               Message Sender                               #
# -------------------------------------------------------------------------- #

# async def send_player_data(player_data, game_id: str):
# 	msg = json.dumps(player_data)
# 	topic = f'PlayerData-{game_id}'
# 	await send_message(msg, topic, game_id)

async def join_game(game_id: str, game_type: str, is_bot: bool):
	await sio.emit('join-game', (game_id, game_type, is_bot))

async def send_message(msg: str, topic: str, game_id: str):
	await sio.emit('send-message-to-game', (msg, topic, game_id))

async def send_paddle_data(paddle_data: str, game_id: str):
	msg = paddle_data
	topic = f'paddleUpdate-{game_id}'
	await send_message(msg, topic, game_id)

# -------------------------------------------------------------------------- #
#                                   Curses                                   #
# -------------------------------------------------------------------------- #

def draw_paddle(stdscr, paddle, global_paddle):
	if global_paddle['y'][0] != paddle['y'][0]:
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], '')
		for i in range(len(global_paddle['y'])):
			paddle['y'][i] = global_paddle['y'][0] + i
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], '|')
	return paddle

def draw_ball(stdscr, ball, global_ball):
	if global_ball['x'] != ball['x'] or global_ball['y'] != ball['y']:
		stdscr.addstr(ball['y'], ball['x'], ' ')
		ball['x'] = global_ball['x']
		ball['y'] = global_ball['y']
		stdscr.addstr(global_ball['y'], global_ball['x'], 'O')
	return ball

def draw_scene(stdscr, game_state, global_game_state):
	game_state['left_paddle'] = draw_paddle(stdscr, game_state['left_paddle'], global_game_state['left_paddle'])
	game_state['right_paddle'] = draw_paddle(stdscr, game_state['right_paddle'], global_game_state['right_paddle'])
	game_state['ball'] = draw_ball(stdscr, game_state['ball'], global_game_state['ball'])
	stdscr.refresh()
	return game_state

def move_paddle(paddle, key):
	if key == curses.KEY_UP:
		for i in range(len(paddle['y'])):
			paddle['y'][i] -= 5
		asyncio.run(send_paddle_data(paddle['y'][0], game_id))
	elif key == curses.KEY_DOWN:
		for i in range(len(paddle['y'])):
			paddle['y'][i] += 5
		asyncio.run(send_paddle_data(paddle['y'][0], game_id))
	return paddle

def curses_thread(stdscr):
	curses.curs_set(False)
	stdscr.nodelay(True)
	stdscr.keypad(True)

	init_scaling_factors()

	global g_game_state
	g_game_state = init_game_state()
	game_state = init_game_state()

	while True:
		# print(RED + f"g_game_state: {g_game_state}" + RESET)
		# print(RED + f"game_state: {game_state}" + RESET)
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q'):
			break
		game_state['right_paddle'] = move_paddle(game_state['right_paddle'], key)
		game_state = draw_scene(stdscr, game_state, g_game_state)

def start_curses():
	curses.wrapper(curses_thread)

# -------------------------------------------------------------------------- #
#                                    Main                                    #
# -------------------------------------------------------------------------- #

def main():
	threading.Thread(target=start_curses, daemon=True).start()
	try:
		asyncio.run(start_socketio())
	except KeyboardInterrupt:
		logging.info(YELLOW + "KeyboardInterrupt caught, cleaning up" + RESET)
	except asyncio.CancelledError:
		logging.info(YELLOW + "Asyncio task was cancelled" + RESET)

if __name__ == '__main__':
	main()

# goals
	# play pong with webclient
	# create game
	# join game
	# leave game
	# rematch
	# pause button
	# react to opponent disconnecting
	# login in with wallet
	# separate into socket file and cli file
	# restrict paddle movement to boundaries
	# pass url and port as arguments
	# how to start cli-client? makefile?
# approach
	# create communication interface
	# make it controllable via terminal
	# visualize pong in terminal
# bottlenecks
	# how to make interactive terminal
	# creating and debugging all the little server<>client interactions
		# game logic has to run on webclient always
	# merge with latest branch
# one thing
	# 

# @note messages
		# server-receive
			# join-game
			# create-game
			# send-message-to-game
			# disconnect
		# server-send
			# room-joined-$gameId
			# message-$gameId-$topic
			# game-created-$msg (msg is a random hex string?)

# @note topics
		# Players-$gameId
		# player-disconnected-$gameId
		# Paddle-$gameId
		# PlayerData-$gameId
		# Request-Rematch-$gameId
		# Pause-$gameId