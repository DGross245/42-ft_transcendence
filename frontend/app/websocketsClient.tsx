'use client';

import useWSClient from '@/helpers/wsclient';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const WebSocketClient = () => {
	const [gameId, setGameId] = useState('');
	// const [topic, setTopic] = useState('');
	// const [message, setMessage] = useState('');
	const wsclient = useWSClient();

	const onCreateGame = async () => {
		if (!wsclient) return;
		const gameId = await wsclient.createGame();
		setGameId(gameId);
	}
	// const onSubscribeTopic = () => {
	// 	if (!wsclient) return;
	// 	wsclient.addMessageListener(topic, gameId, (msg: string) => {
	// 		setMessage(msg);
	// 	});
	// }

	// const onSendMesage = (topic: string) => {
	// 	if (!wsclient) return;
	// 	wsclient.emitMessageToGame(message, topic, gameId);
	// }

	// const onTopicChange = (e: any) => {
	// 	setTopic(e.target.value);
	// 	if (!wsclient) return;
	// 	wsclient.removeMessageListener(topic, gameId);
	// }

	const onJoinGame = () => {
		if (!wsclient) return;
		wsclient.joinGame(gameId);
		console.log("joining...")
	}

	return (<>
		<section className='flex flex-col'>
			<div className='flex'>
				<input
					placeholder="GameJoin"
					value={gameId}
					onChange={(e) => setGameId(e.target.value)}
				/>
				<button onClick={onJoinGame}>Join Game</button>
			</div>
			<div className='flex'>
				<input
					placeholder="GameId"
					value={gameId}
					onChange={(e) => setGameId(e.target.value)}
				/>
				<button onClick={onCreateGame}>Create Game</button>
			</div>
		</section>
	</>)
}

export default WebSocketClient;
