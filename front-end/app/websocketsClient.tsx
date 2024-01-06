'use client';

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const WSClient = () => {
	const [input, setInput] = useState('')

	const socketInitializer = async () => {
		await fetch('/api/socket');
		socket = io();

		socket.on('connect', () => {
		console.log('connected mm')
		})

		socket.on('update-input', (msg: any) => {
		setInput(msg)
		})
	}
	useEffect(() => {socketInitializer()}, [])

	const onChangeHandler = (e: any) => {
		setInput(e.target.value)
		socket.emit('input-change', e.target.value)
	}

	const onClickHandler = () => {
		socket.emit('read-input');
		socket.on('update-input', (msg: any) => {
			socket.removeListener('update-input');
			alert(msg);
		});
	}

  	return (<>
		<section>
			<input
				placeholder="Type something"
				value={input}
				onChange={onChangeHandler}
			/>
			<button onClick={onClickHandler}>Read Storage</button>
		</section>
	</>)
}

export default WSClient;
