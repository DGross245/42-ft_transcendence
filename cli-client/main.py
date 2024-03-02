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
g_paddle_data = 0

g_left_paddle = {
	'x': 5,
	'y': [
		0,
		1,
		2,
		3,
		4
	]
}

g_right_paddle = {
	'x': 0,
	'y': [
		0,
		1,
		2,
		3,
		4
	]
}

g_ball = {
	'x': 0,
	'y': 0,
}

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
	logging.info(RED + f'Received Paddle Data: {msg}' + RESET)
	

@sio.on(f'message-{game_id}-ballUpdate-{game_id}')
async def receive_ball_data(msg: str):
	ball_data = json.loads(msg)
	logging.info(RED + f'Received Ball Data: {ball_data}' + RESET)
	global g_ball
	g_ball = {
		'x': int(ball_data['position']['x']) + 50,
		'y': int(ball_data['position']['z']) - 50
	}

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

def draw_paddle(stdscr, paddle):
	for i in range(len(paddle['y'])):
		stdscr.addstr(paddle['y'][i], paddle['x'], '|')

def draw_scene(stdscr, left_paddle, right_paddle, ball):
	# stdscr.clear()
	draw_paddle(stdscr, left_paddle)
	draw_paddle(stdscr, right_paddle)
	stdscr.addstr(ball['y'], ball['x'], 'O')
	stdscr.refresh()

def curses_thread(stdscr):
	curses.curs_set(False)
	stdscr.nodelay(True)
	stdscr.keypad(True)

	global g_paddle_data
	global g_left_paddle
	global g_right_paddle
	global g_ball
	g_left_paddle = {
		'x': 5,
		'y': [
			curses.LINES // 2 - 2,
			curses.LINES // 2 - 1,
			curses.LINES // 2,
			curses.LINES // 2 + 1,
			curses.LINES // 2 + 2
		]
	}
	g_right_paddle = {
		'x': curses.COLS - 5,
		'y': [
			curses.LINES // 2 - 2,
			curses.LINES // 2 - 1,
			curses.LINES // 2,
			curses.LINES // 2 + 1,
			curses.LINES // 2 + 2
		]
	}
	g_ball = {
		'x': curses.COLS // 2,
		'y': curses.LINES // 2,
	}

	while True:
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q'):
			break
		elif key == curses.KEY_UP:
			g_paddle_data -= 5
			asyncio.run(send_paddle_data(g_paddle_data, game_id))
		elif key == curses.KEY_DOWN:
			g_paddle_data += 5
			asyncio.run(send_paddle_data(g_paddle_data, game_id))
		draw_scene(stdscr, g_left_paddle, g_right_paddle, g_ball)

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