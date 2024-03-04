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
paddle_speed = 2

g_game_width = 300
g_game_height = 200
g_scaling_factor_width = 1
g_scaling_factor_height = 1

g_game_state = {}

# -------------------------------------------------------------------------- #
#                                   Utils                                    #
# -------------------------------------------------------------------------- #

def server_y_to_cli_y(server_y):
	return (int(server_y * g_scaling_factor_height + curses.LINES // 2))

def server_x_to_cli_x(server_x):
	return (int(server_x * g_scaling_factor_width + curses.COLS // 2))

def server_paddle_y_to_cli_paddle_y(server_paddle_y, cli_paddle_length):
	cli_paddle_y = []
	i = cli_paddle_length // 2 * -1
	while i <= cli_paddle_length // 2:
		cli_paddle_y.append(server_y_to_cli_y(server_paddle_y) + i)
		i += 1
	return cli_paddle_y

def cli_y_to_server_y(cli_y):
	server_y = (cli_y - curses.LINES // 2) / g_scaling_factor_height
	return server_y

def init_game_state():
	game_state = {
		'ball': {
			'x': 0,
			'y': 0
		},
		'left_paddle': {
			'x': server_x_to_cli_x(-g_game_width // 2 + 1),
			'y': [
				curses.LINES // 2 - 2,
				curses.LINES // 2 - 1,
				curses.LINES // 2,
				curses.LINES // 2 + 1,
				curses.LINES // 2 + 2
			]
		},
		'right_paddle': {
			'x': server_x_to_cli_x(g_game_width // 2 - 1),
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

def init_game_state_empty():
	game_state = {
		'ball': {
			'x': 0,
			'y': 0
		},
		'left_paddle': {
			'x': server_x_to_cli_x(-g_game_width / 2 + 1),
			'y': [0, 0, 0, 0, 0]
		},
		'right_paddle': {
			'x': server_x_to_cli_x(g_game_width / 2 - 1),
			'y': [0, 0, 0, 0, 0]
		}
	}
	return game_state

def init_scaling_factors():
	global g_scaling_factor_height
	global g_scaling_factor_width
	g_scaling_factor_height = curses.LINES / g_game_height / 2
	g_scaling_factor_width = curses.COLS / g_game_width / 2

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
		'x': server_x_to_cli_x(ball_pos['x']),
		'y': server_y_to_cli_y(ball_pos['z'])
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

async def send_paddle_data(paddle_y: str, game_id: str):
	msg = cli_y_to_server_y(paddle_y)
	topic = f'paddleUpdate-{game_id}'
	await send_message(msg, topic, game_id)

# -------------------------------------------------------------------------- #
#                                   Curses                                   #
# -------------------------------------------------------------------------- #

def draw_paddle(stdscr, paddle, global_paddle):
	if global_paddle['y'][0] != paddle['y'][0]:
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], ' ')
		for i in range(len(global_paddle['y'])):
			paddle['y'][i] = global_paddle['y'][0] + i
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], '|')
	return paddle

def draw_ball(stdscr, ball, global_ball):
	if global_ball['x'] != ball['x'] or global_ball['y'] != ball['y']:
		if global_ball['x'] >= server_x_to_cli_x(g_game_width // 2 * -1) and global_ball['x'] <= server_x_to_cli_x(g_game_width // 2 - 1) and global_ball['y'] >= server_y_to_cli_y(g_game_height // 2 * -1) and global_ball['y'] <= server_y_to_cli_y(g_game_height // 2 - 1):
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
	offset = 0
	if key == curses.KEY_UP:
		offset = paddle_speed * -1
	elif key == curses.KEY_DOWN:
		offset = paddle_speed
	if offset != 0 and paddle['y'][0] + offset >= server_y_to_cli_y(-g_game_height // 2) and paddle['y'][-1] + offset <= server_y_to_cli_y(g_game_height // 2):
		i = paddle_length // 2 * -1
		while i <= paddle_length // 2:
			paddle['y'][i] += offset
			i += 1
		asyncio.run(send_paddle_data(paddle['y'][paddle_length // 2], game_id))
	return paddle

def draw_score(stdscr, score):
	

def curses_thread(stdscr):
	curses.curs_set(False)
	stdscr.nodelay(True)
	stdscr.keypad(True)

	init_scaling_factors()

	global g_game_state
	g_game_state = init_game_state()
	game_state = init_game_state_empty()

	while True:
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q'):
			break
		g_game_state['right_paddle'] = move_paddle(g_game_state['right_paddle'], key)
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