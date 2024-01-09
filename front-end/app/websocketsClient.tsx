'use client';

import useWSClient from '@/helpers/wsclient';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const WebSocketClient = () => {
	const [gameId, setGameId] = useState('');
	const [topic, setTopic] = useState('');
	const [message, setMessage] = useState('');
	const wsclient = useWSClient();

	// This function triggers the creation of a new game by calling
	const onCreateGame = async () => {
		if (!wsclient) return;
		const gameId = await wsclient.createGame();
		setGameId(gameId);
	}

	// When invoked, this function subscribes the client to a specific topic by adding
	// a message listener using wsclient.addMessageListener.
	// When a message is received on that topic, it updates the message state.
	const onSubscribeTopic = () => {
		if (!wsclient) return;
		wsclient.addMessageListener(topic, gameId, (msg: string) => {
			setMessage(msg);
		});
	}

	// This function sends a message to a specific game using
	// wsclient.emitMessageToGame.
	// It utilizes the message, topic, and gameId states to send
	// the message to the appropriate destination.

	//!! typo !!
	const onSendMesage = () => {
		if (!wsclient) return;
		wsclient.emitMessageToGame(message, topic, gameId);
	}

	// This function captures the changes in the topic input field.
	// It updates the topic state accordingly and removes any
	// existing message listener associated with the previous topic
	// and game ID using wsclient.removeMessageListener.
	const onTopicChange = (e: any) => {
		setTopic(e.target.value);
		if (!wsclient) return;
		wsclient.removeMessageListener(topic, gameId);
	}

	return (<>
		<section className='flex flex-col'>
			<div className='flex'>
				<input
					placeholder="GameId"
					value={gameId}
					onChange={(e) => setGameId(e.target.value)}
				/>
				<button onClick={onCreateGame}>Create Game</button>
			</div>
			<div className='flex'>
				<input
					placeholder="Topic"
					value={topic}
					onChange={onTopicChange}
				/>
				<button onClick={onSubscribeTopic}>Subscribe Topic</button>
			</div>
			<div className='flex'>
				<input
					placeholder="Message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button onClick={onSendMesage}>Send Message</button>
			</div>
		</section>
	</>)
}

export default WebSocketClient;
