import requests
import socketio
import logging
import asyncio
import threading
import json
import curses
import signal
import time

# -------------------------------------------------------------------------- #
#                               Data Structure                               #
# -------------------------------------------------------------------------- #

# colors
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

logging.basicConfig(level=logging.INFO)
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
paddle_length = 3
paddle_speed = 1
score_offset = 46
win_score = 7

g_game_width = 300
g_game_height = 200
g_scaling_factor_width = 1
g_scaling_factor_height = 1

g_game_state = {}

event_quit = threading.Event()
event_room_full = threading.Event()
event_game_active = threading.Event()
event_pause = threading.Event()
event_socket_ready = threading.Event()

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
				curses.LINES // 2 - 1,
				curses.LINES // 2,
				curses.LINES // 2 + 1,
			]
		},
		'right_paddle': {
			'x': server_x_to_cli_x(g_game_width // 2 - 1),
			'y': [
				curses.LINES // 2 - 1,
				curses.LINES // 2,
				curses.LINES // 2 + 1,
			]
		},
		'score': {
			'left': 0,
			'right': 0
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
		},
		'score': {
			'left': 0,
			'right': 0
		}
	}
	return game_state

def init_scaling_factors():
	global g_scaling_factor_height
	global g_scaling_factor_width
	g_scaling_factor_height = curses.LINES / g_game_height / 2
	g_scaling_factor_width = curses.COLS / g_game_width / 2

# -------------------------------------------------------------------------- #
#                               Signal Handler                               #
# -------------------------------------------------------------------------- #

def signal_handler(sig, frame):
	event_quit.set()
	logging.info(YELLOW + "SIG INT detected" + RESET)

# -------------------------------------------------------------------------- #
#                                Socket Setup                                #
# -------------------------------------------------------------------------- #

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

async def socket_initialize():
	try:
		requests.get('http://localhost:3000/api/socket')
		await sio.connect('http://localhost:3000')
	except Exception as e:
		logging.error(RED + f'Error connecting to server: {e}' + RESET)
		event_quit.set()
		return
	logging.debug(YELLOW + f'socket initialized' + RESET)
	event_socket_ready.set()

async def start_socketio():
	try:
		await socket_initialize()
		joined_game = False
		while not event_quit.is_set():
			if event_game_active.is_set() and not joined_game:
				await join_game(game_id, 'Pong', False)
				joined_game = True
			if not event_game_active.is_set():
				joined_game = False
			await asyncio.sleep(0.1)
	except asyncio.CancelledError:
		logging.debug(YELLOW + "Asyncio task was cancelled" + RESET)
	finally:
		await sio.disconnect()
		logging.debug(YELLOW + "Disconnected" + RESET)

# -------------------------------------------------------------------------- #
#                              Message Handler                               #
# -------------------------------------------------------------------------- #

# @sio.on(f'message-{game_id}-PlayerData-{game_id}')
# async def receive_player_data(msg: str):
# 	logging.info(RED + f'Opponent data: {msg}' + RESET)
# 	exit

@sio.on(f'message-{game_id}-Players-{game_id}')
async def room_full(msg: str):
	logging.debug(RED + f'Room full: {msg}' + RESET)
	event_room_full.set()

@sio.on(f'room-joined-{game_id}')
async def room_joined(num_clients: int):
	logging.debug(RED + f'Room joined, number of clients: {num_clients}' + RESET)

@sio.on(f'message-{game_id}-paddleUpdate-{game_id}')
async def receive_paddle_data(msg: str):
	paddle_y = json.loads(msg)
	logging.debug(RED + f'Received Paddle Data: {paddle_y}' + RESET)
	global g_game_state
	g_game_state['left_paddle']['y'] = server_paddle_y_to_cli_paddle_y(int(paddle_y), paddle_length)

@sio.on(f'message-{game_id}-ballUpdate-{game_id}')
async def receive_ball_data(msg: str):
	ball = json.loads(msg)
	ball_pos = ball['position']
	logging.debug(RED + f'Received Ball Data: {ball_pos}' + RESET)
	new_ball = {
		'x': server_x_to_cli_x(ball_pos['x']),
		'y': server_y_to_cli_y(ball_pos['z'])
	}
	global g_game_state
	g_game_state['ball']['x'] = int(new_ball['x'])
	g_game_state['ball']['y'] = int(new_ball['y'])

@sio.on(f'message-{game_id}-player-disconnected-${game_id}')
async def player_disconnected(msg: str):
	logging.debug(RED + f'Player disconnected: {msg}' + RESET)
	print("Player disconnected")
	event_quit.set()

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
	try:
		await sio.emit('send-message-to-game', (msg, topic, game_id))
	except Exception as e:
		logging.error(RED + f'Error sending message: {e}' + RESET)
		event_game_active.clear()

async def send_paddle_data(paddle_y: str, game_id: str):
	msg = cli_y_to_server_y(paddle_y)
	topic = f'paddleUpdate-{game_id}'
	await send_message(msg, topic, game_id)

# -------------------------------------------------------------------------- #
#                                   Curses                                   #
# -------------------------------------------------------------------------- #

def draw_paddle(stdscr, paddle, global_paddle):
	for i in range(len(paddle['y'])):
		if paddle['y'][i] != '|':
			stdscr.addstr(paddle['y'][i], paddle['x'], '|')
	if global_paddle['y'][0] != paddle['y'][0]:
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], ' ')
		for i in range(len(global_paddle['y'])):
			paddle['y'][i] = global_paddle['y'][0] + i
		for i in range(len(paddle['y'])):
			stdscr.addstr(paddle['y'][i], paddle['x'], '|')
	return paddle

def draw_ball(stdscr, ball, global_ball, score):
	if global_ball['x'] != ball['x'] or global_ball['y'] != ball['y']:
		stdscr.addstr(ball['y'], ball['x'], ' ')
		stdscr.addstr(global_ball['y'], global_ball['x'], 'O')
		global g_game_state
		if global_ball['x'] < server_x_to_cli_x(g_game_width // 2 * -1 - score_offset):
			score['right'] += 1
		elif global_ball['x'] > server_x_to_cli_x(g_game_width // 2 + score_offset):
			score['left'] += 1
		ball['x'] = global_ball['x']
		ball['y'] = global_ball['y']
	return ball

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

def draw_score(stdscr, game_state):
	stdscr.addstr(2, curses.COLS // 2 - 3, f"{game_state['score']['left']} : {game_state['score']['right']}")

def draw_field(stdscr):
	i = server_x_to_cli_x(-g_game_width / 2 + 1)
	while i <= server_x_to_cli_x(g_game_width / 2 - 1):
		stdscr.addstr(server_y_to_cli_y(-g_game_height // 2) - 1, i, '-')
		stdscr.addstr(server_y_to_cli_y(g_game_height // 2) + 1, i, '-')
		i += 1
	i = server_y_to_cli_y(-g_game_height // 2)
	while i <= server_y_to_cli_y(g_game_height // 2):
		stdscr.addstr(i, server_x_to_cli_x(0) - 1, '|')
		i += 2

def draw_box(stdscr, y, x, height, width):
	for i in range(height):
		for j in range(width):
			stdscr.addstr(y + i, x + j, ' ')
	for i in range(height):
		stdscr.addstr(y + i, x, '|')
		stdscr.addstr(y + i, x + width - 1, '|')
	for i in range(width):
		stdscr.addstr(y, x + i, '-')
		stdscr.addstr(y + height, x + i, '-')

def draw_end_screen(stdscr, game_state):
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	if game_state['score']['left'] == 7:
		stdscr.addstr(curses.LINES // 2 - 2, curses.COLS // 2 - 5, "YOU LOSE!")
	else:
		stdscr.addstr(curses.LINES // 2 - 2, curses.COLS // 2 - 4, "YOU WIN!")
	stdscr.addstr(curses.LINES // 2 + 2, curses.COLS // 2 - 8, "press 'space' to continue")

def draw_start_screen(stdscr):
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 10, "Welcome to Pong!")
	stdscr.addstr(curses.LINES // 2 - 2, curses.COLS // 2 - 14, "press 'space' to start")
	stdscr.addstr(curses.LINES // 2 + 2, curses.COLS // 2 - 8, "press 'q' to quit")

def draw_wait_screen(stdscr):
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 10, "Waiting for opponent...")
	stdscr.addstr(curses.LINES // 2 + 2, curses.COLS // 2 - 8, "press 'q' to quit")

def draw_countdown(stdscr):
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	count = 3
	while count > 0:
		stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 15, f"Starting in {count}...")
		stdscr.refresh()
		time.sleep(1)
		count -= 1
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 10, "GO!")
	stdscr.refresh()
	time.sleep(1)

def curses_thread(stdscr):
	curses.curs_set(False)
	stdscr.nodelay(True)
	stdscr.keypad(True)

	draw_start_screen(stdscr)
	while not event_game_active.is_set() and not event_quit.is_set():
		key = stdscr.getch()
		if key == ord(' '):
			event_game_active.set()
		if key == ord('q'):
			return
	stdscr.clear()
	draw_wait_screen(stdscr)
	while not event_room_full.is_set() and not event_quit.is_set():
		key = stdscr.getch()
		if key == ord('q'):
			return
	stdscr.clear()
	init_scaling_factors()
	global g_game_state
	g_game_state = init_game_state()
	game_state = init_game_state_empty()
	draw_field(stdscr)
	draw_countdown(stdscr)
	stdscr.clear()
	while event_game_active.is_set() and not event_quit.is_set() and g_game_state['score']['left'] < win_score and g_game_state['score']['right'] < win_score:
		key = stdscr.getch()
		g_game_state['right_paddle'] = move_paddle(g_game_state['right_paddle'], key)
		game_state['left_paddle'] = draw_paddle(stdscr, game_state['left_paddle'], g_game_state['left_paddle'])
		game_state['right_paddle'] = draw_paddle(stdscr, game_state['right_paddle'], g_game_state['right_paddle'])
		game_state['ball'] = draw_ball(stdscr, game_state['ball'], g_game_state['ball'], g_game_state['score'])
		draw_score(stdscr, g_game_state)
		draw_field(stdscr)
		stdscr.refresh()
	draw_end_screen(stdscr, g_game_state)
	while not event_quit.is_set():
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q') or key == ord(' '):
			return

def start_curses():
	while (not event_socket_ready.is_set() and not event_quit.is_set()):
		time.sleep(0.1)
	if not event_quit.is_set():
		curses.wrapper(curses_thread)
		curses.endwin()
		event_quit.set()
		logging.debug(YELLOW + "Curses thread ended" + RESET)

# -------------------------------------------------------------------------- #
#                                    Main                                    #
# -------------------------------------------------------------------------- #

def main():
	try:
		signal.signal(signal.SIGINT, signal_handler)
		curses_thread = threading.Thread(target=start_curses, daemon=True)
		curses_thread.start()
		asyncio.run(start_socketio())
	except KeyboardInterrupt:
		logging.info(YELLOW + "KeyboardInterrupt caught, cleaning up" + RESET)
	except asyncio.CancelledError:
		logging.debug(YELLOW + "Asyncio task was cancelled" + RESET)
	finally:
		logging.info(YELLOW + "Exiting" + RESET)
		event_quit.set()
		curses_thread.join()

if __name__ == '__main__':
	main()

# goals
	# create game
		# allow cli client to join first without hosting game
	# join game
	# leave game
	# rematch
	# pause button
	# react to opponent disconnecting
	# login in with wallet
	# pass url and port as arguments
	# how to start cli-client? makefile?
	# fix scaling issues at very wide widths and small heights
	# add countdown
# approach
	# create communication interface
	# make it controllable via terminal
	# visualize pong in terminal
# bottlenecks
	# error handling
	# login
	# additional server interactions (create game, join game, etc.)
	# refactoring
	# merge with latest branch
# one thing
	# error handling

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