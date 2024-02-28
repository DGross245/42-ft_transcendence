import requests
import socketio
import logging
import asyncio
import json

# colors
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

logging.basicConfig(level=logging.INFO)
logging.basicConfig(level=logging.DEBUG)

player_data = {
	'name': 'CLI-KEK',
	'color': 0x00ff00,
	'number': 1 # client number
}

# setup
sio = socketio.AsyncClient(logger=True, engineio_logger=True)

namespace = '/'
game_id = "0"

async def socket_initialize():
	# makes server initialize socket
	requests.get('http://localhost:3000/api/socket')
	await sio.connect('http://localhost:3000')
	logging.info(YELLOW + f'socket initialized' + RESET)




@sio.on(f'room-joined-{game_id}')
async def room_joined(num_clients: int):
	logging.info(RED + f'Room joined, number of clients: {num_clients}' + RESET)

@sio.on(f'message-{game_id}-Players-{game_id}')
async def room_full(msg: str):
	logging.info(RED + f'Room full: {msg}' + RESET)
	exit

@sio.on(f'message-{game_id}-PlayerData-{game_id}')
async def receive_player_data(msg: str):
	logging.info(RED + f'Opponent data: {msg}' + RESET)
	exit

@sio.on(f'message-{game_id}-paddleUpdate-{game_id}')
async def receive_paddle_data(msg: str):
	logging.info(RED + f'Received Paddle Data: {msg}' + RESET)

@sio.on(f'message-{game_id}-ballUpdate-{game_id}')
async def receive_ball_data(msg: str):
	ball_data = json.loads(msg)
	logging.info(RED + f'Received Ball Data: {ball_data}' + RESET)
	paddle_data = ball_data['position']['z']
	await send_paddle_data(paddle_data, game_id)




async def join_game(game_id: str, game_type: str, is_bot: bool):
	await sio.emit('join-game', (game_id, game_type, is_bot))

async def send_message(msg: str, topic: str, game_id: str):
	await sio.emit('send-message-to-game', (msg, topic, game_id))

async def send_player_data(player_data, game_id: str):
	msg = json.dumps(player_data)
	topic = f'PlayerData-{game_id}'
	await send_message(msg, topic, game_id)

async def send_paddle_data(paddle_data: str, game_id: str):
	msg = paddle_data
	topic = f'paddleUpdate-{game_id}'
	await send_message(msg, topic, game_id)





async def main():
	try:
		await socket_initialize()
		await join_game(game_id, 'Pong', False)
		# await send_player_data(player_data, game_id)

		await sio.wait()
	except asyncio.CancelledError:
		logging.info(YELLOW + "Asyncio task was cancelled" + RESET)
	finally:
		await sio.disconnect()
		logging.info(YELLOW + "Disconnected" + RESET)

if __name__ == '__main__':
	try:
		asyncio.run(main())
	except KeyboardInterrupt:
		logging.info(YELLOW + "KeyboardInterrupt caught, cleaning up" + RESET)
	except asyncio.CancelledError:
		logging.info(YELLOW + "Asyncio task was cancelled" + RESET)


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