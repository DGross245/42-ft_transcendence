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

# setup
sio = socketio.AsyncClient(logger=True, engineio_logger=True)

async def socket_initialize():
	# makes server initialize socket
	requests.get('http://localhost:3000/api/socket')
	await sio.connect('http://localhost:3000')
	logging.info(YELLOW + f'socket initialized' + RESET)

async def room_joined(num_clients: int):
	logging.info(RED + f'Room joined, number of clients: {num_clients}' + RESET)

async def join_game(game_id: str, game_type: str, is_bot: bool, namespace: str):
	await sio.emit('join-game', (game_id, game_type, is_bot), namespace=namespace)

async def send_message(msg: str, topic: str, game_id: str, namespace: str):
	await sio.emit('send-message-to-game', (msg, topic, game_id), namespace=namespace)

async def send_player_data(game_id: str, namespace: str):
	async def opponent_data(data: str):
		logging.info(RED + f'Opponent data: {data}' + RESET)
	event_name = 'PlayerData-{game_id}'
	sio.on(event_name, handler=opponent_data, namespace=namespace)

	player_data = {
		'name': 'KEK',
		'color': 0x00ff00,
		'number': 1 # client number
	}
	msg = json.dumps(player_data)
	topic = 'PlayerData-{game_id}'
	await send_message(msg, topic, game_id, namespace)

async def main():
	namespace = '/'
	game_id = "0"
	try:
		await socket_initialize()
		await join_game(game_id, 'Pong', False, namespace)
		event_name = 'room-joined-{game_id}'
		sio.on(event_name, handler=room_joined, namespace=namespace)
		# await send_player_data(game_id, namespace)

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
