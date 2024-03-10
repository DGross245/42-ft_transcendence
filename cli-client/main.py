import requests
import socketio
import logging
import asyncio
import threading
import json
import curses
import signal
import time
import math
import argparse

# -------------------------------------------------------------------------- #
#                               Data Structure                               #
# -------------------------------------------------------------------------- #

# colors
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.ERROR)
# logging.basicConfig(level=logging.DEBUG)

player_data = {
	'name': 'CLI-KEK',
	'color': 0x00ff00,
	'number': 1 # client number
}

class Quit(Exception):
	pass

class WindowTooSmall(Exception):
	pass

# -------------------------------------------------------------------------- #
#                                  Globals                                   #
# -------------------------------------------------------------------------- #

parser = argparse.ArgumentParser(description='CLI Pong Client')
parser.add_argument('ip_addr', type=str, help='IP Address')
parser.add_argument('port', type=str, help='Port')
parser.add_argument('-g', '--game_id', type=str, help='Game ID', default='-1')
args = parser.parse_args()
g_game_id = args.game_id

g_paddle_length = 0
g_paddle_speed = 1
g_score_offset = 46
g_win_score = 7

g_server_game_width = 298
g_server_game_height = 206
g_server_paddle_length = 30
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
	return (int(server_y * g_scaling_factor_height + curses.LINES / 2))

def server_x_to_cli_x(server_x):
	return (int(server_x * g_scaling_factor_width + curses.COLS / 2))

def cli_y_to_server_y(cli_y):
	server_y = (cli_y - curses.LINES / 2) / g_scaling_factor_height
	return server_y

def init_game_state():
	game_state = {
		'ball': {
			'x': 0,
			'y': 0
		},
		'left_paddle': {
			'x': server_x_to_cli_x(-g_server_game_width // 2 + 1),
			'y': curses.LINES // 2 - g_paddle_length // 2,
		},
		'right_paddle': {
			'x': server_x_to_cli_x(g_server_game_width // 2 - 1),
			'y': curses.LINES // 2 - g_paddle_length // 2,
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
			'x': server_x_to_cli_x(-g_server_game_width / 2 + 1),
			'y': 0
		},
		'right_paddle': {
			'x': server_x_to_cli_x(g_server_game_width / 2 - 1),
			'y': 0
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
	global g_paddle_length
	global g_paddle_speed
	g_scaling_factor_height = curses.LINES / g_server_game_height / 2
	g_scaling_factor_width = curses.COLS / g_server_game_width / 2
	while g_paddle_length % 2 != 0 or g_paddle_length == 0:
		g_scaling_factor_height -= 0.01
		g_scaling_factor_width -= 0.01
		g_paddle_length = int((g_server_game_height * g_scaling_factor_height) / (g_server_game_height / g_server_paddle_length))
	g_paddle_speed = int(g_server_game_height * g_scaling_factor_height // 10)

# -------------------------------------------------------------------------- #
#                               Signal Handler                               #
# -------------------------------------------------------------------------- #

def handle_sigint(sig, frame):
	event_quit.set()
	logging.info(YELLOW + "SIG INT detected" + RESET)

def handle_resize(sig, frame):
	if curses.LINES < 20 or curses.COLS < 50:
		logging.error(RED + "Terminal too small, exiting" + RESET)
		event_quit.set()
		return
	init_scaling_factors()
	logging.debug(YELLOW + "SIG WINCH detected" + RESET)

# -------------------------------------------------------------------------- #
#                                Socket Setup                                #
# -------------------------------------------------------------------------- #

sio = socketio.AsyncClient(logger=False, engineio_logger=False)

async def socket_initialize():
	try:
		requests.get('http://' + args.ip_addr + ':' + args.port + '/api/socket')
		await sio.connect('http://' + args.ip_addr + ':' + args.port)
	except Exception as e:
		logging.error(RED + f'Error connecting to server: {e}' + RESET)
		event_quit.set()
		return
	logging.debug(YELLOW + f'socket initialized' + RESET)
	event_socket_ready.set()

async def socketio_loop():
	try:
		await socket_initialize()
		joined_game = False
		while not event_quit.is_set() and sio.connected:
			if event_game_active.is_set() and not joined_game:
				if g_game_id == '-1':
					await create_game('Pong')
				register_message_handlers()
				await join_game(g_game_id, 'Pong', False)
				joined_game = True
			if not event_game_active.is_set():
				joined_game = False
			await asyncio.sleep(0.1)
	except asyncio.CancelledError:
		logging.error(YELLOW + "Asyncio task was cancelled" + RESET)
	except asyncio.TimeoutError:
		logging.error(RED + "Timeout error. Is the server still running?" + RESET)
	except Exception as e:
		logging.error(RED + f'Error: {e}' + RESET)
	finally:
		await sio.disconnect()
		logging.debug(YELLOW + "Disconnected" + RESET)
	event_quit.set()

# -------------------------------------------------------------------------- #
#                              Message Handler                               #
# -------------------------------------------------------------------------- #

# @sio.on(f'message-{game_id}-PlayerData-{game_id}')
# async def receive_player_data(msg: str):
# 	logging.info(RED + f'Opponent data: {msg}' + RESET)
# 	exit

@sio.event
async def connect():
	logging.debug("Connected to server")

@sio.event
async def disconnect():
	logging.debug("Disconnected from server")
	event_quit.set()


@sio.on(f'match-found')
async def match_found(msg: str, placeholder: int, placeholder2: int):
	logging.debug(RED + f'Match found: {msg}' + RESET)
	global g_game_id
	g_game_id = msg

def register_message_handlers():

	@sio.on(f'message-{g_game_id}-Players-{g_game_id}')
	async def room_full(msg: str):
		logging.debug(RED + f'Room full: {msg}' + RESET)
		event_room_full.set()
		await inform_server_is_cli(g_game_id)

	@sio.on(f'room-joined-{g_game_id}')
	async def room_joined(num_clients: int):
		logging.debug(RED + f'Room joined, number of clients: {num_clients}' + RESET)

	@sio.on(f'message-{g_game_id}-paddleUpdate-{g_game_id}')
	async def receive_paddle_data(msg: str):
		paddle_y = json.loads(msg)
		logging.debug(RED + f'Received Paddle Data: {paddle_y}' + RESET)
		global g_game_state
		g_game_state['left_paddle']['y'] = server_y_to_cli_y(paddle_y) - g_paddle_length // 2

	@sio.on(f'message-{g_game_id}-ballUpdate-{g_game_id}')
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

	@sio.on(f'message-{g_game_id}-ScoreUpdate-{g_game_id}')
	async def receive_score_data(msg: str):
		score = json.loads(msg)
		logging.debug(RED + f'Received Score Data: {score}' + RESET)
		global g_game_state
		g_game_state['score']['left'] = score['p1Score']
		g_game_state['score']['right'] = score['p2Score']

	@sio.on(f'message-{g_game_id}-Pause-{g_game_id}')
	async def receive_pause_data(msg: str):
		logging.debug(RED + f'Pause: {msg}' + RESET)
		await send_message('true', f'Continue-{g_game_id}', g_game_id)

	@sio.on(f'message-{g_game_id}-player-left-${g_game_id}')
	async def player_disconnected(msg: str):
		logging.info(RED + f'Player disconnected: {msg}' + RESET)
		event_quit.set()

# -------------------------------------------------------------------------- #
#                               Message Sender                               #
# -------------------------------------------------------------------------- #

# async def send_player_data(player_data, game_id: str):
# 	msg = json.dumps(player_data)
# 	topic = f'PlayerData-{game_id}'
# 	await send_message(msg, topic, game_id)

async def create_game(game_type: str):
	try:
		await sio.emit('create-game', (game_type))
		timeout = 5
		while g_game_id == '-1' and not event_quit.is_set() and timeout > 0:
			await asyncio.sleep(1)
			timeout -= 1
	except Exception as e:
		logging.error(RED + f'Error creating game: {e}' + RESET)
		event_quit.set()

async def join_game(game_id: str, game_type: str, is_bot: bool):
	try:
		await sio.emit('join-game', (game_id, game_type, is_bot))
	except Exception as e:
		logging.error(RED + f'Error joining game: {e}' + RESET)
		event_quit.set()

async def inform_server_is_cli(game_id: str):
	await send_message('CLI', f'IsCLI-{game_id}', game_id)

async def send_message(msg: str, topic: str, game_id: str):
	try:
		await sio.emit('send-message-to-game', (msg, topic, game_id))
	except Exception as e:
		logging.error(RED + f'Error sending message: {e}' + RESET)
		event_game_active.clear()
		event_quit.set()

async def send_paddle_data(paddle_y: str, game_id: str):
	msg = cli_y_to_server_y(paddle_y + g_paddle_length // 2)
	topic = f'paddleUpdate-{game_id}'
	await send_message(msg, topic, game_id)

# -------------------------------------------------------------------------- #
#                                   Curses                                   #
# -------------------------------------------------------------------------- #

def draw_paddle(stdscr, paddle, global_paddle):
	first = paddle['y']
	for _ in range(g_paddle_length):
		stdscr.addstr(first, paddle['x'], '|')
		first += 1
	if global_paddle['y'] != paddle['y']:
		first = paddle['y']
		for _ in range(g_paddle_length):
			stdscr.addstr(first, paddle['x'], ' ')
			first += 1
		paddle['y'] = global_paddle['y']
	return paddle

def draw_ball(stdscr, ball, global_ball, score):
	if global_ball['x'] != ball['x'] or global_ball['y'] != ball['y']:
		stdscr.addstr(ball['y'], ball['x'], ' ')
		stdscr.addstr(global_ball['y'], global_ball['x'], 'O')
		ball['x'] = global_ball['x']
		ball['y'] = global_ball['y']
	return ball

def move_paddle(paddle, key):
	if key == curses.KEY_UP:
		if paddle['y'] - g_paddle_speed > server_y_to_cli_y(-g_server_game_height / 2):
			paddle['y'] -= g_paddle_speed
		else:
			paddle['y'] = server_y_to_cli_y(-g_server_game_height / 2)
	elif key == curses.KEY_DOWN:
		if paddle['y'] + g_paddle_speed + g_paddle_length < server_y_to_cli_y(g_server_game_height / 2) + 1:
			paddle['y'] += g_paddle_speed
		else:
			paddle['y'] = server_y_to_cli_y(g_server_game_height / 2) + 1 - g_paddle_length
	asyncio.run(send_paddle_data(paddle['y'], g_game_id))
	return paddle

def draw_score(stdscr, game_state):
	stdscr.addstr(2, curses.COLS // 2 - 3, f"{g_game_state['score']['left']} : {g_game_state['score']['right']}")

def draw_field(stdscr):
	i = server_y_to_cli_y(-g_server_game_height / 2)
	while i < server_y_to_cli_y(g_server_game_height / 2):
		stdscr.addstr(i, server_x_to_cli_x(0), '|')
		i += 2
	i = server_x_to_cli_x(-g_server_game_width / 2)
	while i <= server_x_to_cli_x(g_server_game_width / 2):
		stdscr.addstr(server_y_to_cli_y(-g_server_game_height / 2), i, '-')
		stdscr.addstr(server_y_to_cli_y(g_server_game_height / 2), i, '-')
		i += 1

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
	draw_field(stdscr)
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	count = 3
	while count > 0 and not event_quit.is_set():
		stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 15, f"Starting in {count}...")
		stdscr.refresh()
		time.sleep(1)
		count -= 1
	if event_quit.is_set():
		return
	draw_box(stdscr, curses.LINES // 2 - 7, curses.COLS // 2 - 20, 15, 40)
	stdscr.addstr(curses.LINES // 2 - 4, curses.COLS // 2 - 10, "GO!")
	stdscr.refresh()
	time.sleep(1)

def start_loop(stdscr):
	draw_start_screen(stdscr)
	while not event_game_active.is_set() and not event_quit.is_set():
		key = stdscr.getch()
		if key == ord(' '):
			event_game_active.set()
		if key == ord('q'):
			raise Quit

def wait_loop(stdscr):
	draw_wait_screen(stdscr)
	while not event_room_full.is_set() and not event_quit.is_set():
		key = stdscr.getch()
		if key == ord('q'):
			raise Quit

def game_loop(stdscr):
	global g_game_state
	game_state = init_game_state_empty()
	while event_game_active.is_set() and not event_quit.is_set() and g_game_state['score']['left'] < g_win_score and g_game_state['score']['right'] < g_win_score:
		key = stdscr.getch()
		g_game_state['right_paddle'] = move_paddle(g_game_state['right_paddle'], key)
		game_state['left_paddle'] = draw_paddle(stdscr, game_state['left_paddle'], g_game_state['left_paddle'])
		game_state['right_paddle'] = draw_paddle(stdscr, game_state['right_paddle'], g_game_state['right_paddle'])
		game_state['ball'] = draw_ball(stdscr, game_state['ball'], g_game_state['ball'], g_game_state['score'])
		draw_score(stdscr, g_game_state)
		draw_field(stdscr)
		stdscr.refresh()

def end_loop(stdscr):
	global g_game_state
	draw_end_screen(stdscr, g_game_state)
	while not event_quit.is_set():
		key = stdscr.getch()
		if key == curses.KEY_EXIT or key == ord('q') or key == ord(' '):
			raise Quit

def curses_thread(stdscr):
	curses.curs_set(False)
	stdscr.nodelay(True)
	stdscr.keypad(True)
	if curses.LINES < 20 or curses.COLS < 50:
		raise WindowTooSmall
	init_scaling_factors()
	if g_scaling_factor_height < 0 or g_scaling_factor_width < 0:
		raise WindowTooSmall
	global g_game_state
	g_game_state = init_game_state()
	funcs = [start_loop, wait_loop, draw_countdown, game_loop, end_loop]
	for i in range(len(funcs)):
		stdscr.addstr(0, 0, 'paddle length: ' + str(g_paddle_length))
		stdscr.addstr(1, 0, 'height scaling factor: ' + str(g_scaling_factor_height))
		stdscr.addstr(2, 0, 'width scaling factor: ' + str(g_scaling_factor_width))
		stdscr.addstr(3, 0, 'cli game height: ' + str(g_scaling_factor_height * g_server_game_height))
		stdscr.addstr(4, 0, 'cli game width: ' + str(g_scaling_factor_width * g_server_game_width))
		stdscr.addstr(5, 0, 'upper border: ' + str(server_y_to_cli_y(-g_server_game_height / 2)))
		stdscr.addstr(6, 0, 'lower border: ' + str(server_y_to_cli_y(g_server_game_height / 2)))
		stdscr.addstr(7, 0, 'window height: ' + str(curses.LINES))
		funcs[i](stdscr)
		stdscr.clear()
		if event_quit.is_set():
			raise Quit

def start_curses():
	while (not event_socket_ready.is_set() and not event_quit.is_set()):
		time.sleep(0.1)
	if not event_quit.is_set():
		try:
			curses.wrapper(curses_thread)
			curses.endwin()
		except Quit:
			logging.info(YELLOW + "User quitted" + RESET)
		except WindowTooSmall:
			logging.error(RED + "Terminal too small, exiting" + RESET)
		except Exception as e:
			logging.error(RED + f"Error: {e}" + RESET)
		event_quit.set()
		logging.debug(YELLOW + "Curses thread ended" + RESET)

# -------------------------------------------------------------------------- #
#                                    Main                                    #
# -------------------------------------------------------------------------- #

def main():
	try:
		signal.signal(signal.SIGINT, handle_sigint)
		signal.signal(signal.SIGWINCH, handle_resize)
		curses_thread = threading.Thread(target=start_curses, daemon=True)
		curses_thread.start()
		asyncio.run(socketio_loop())
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