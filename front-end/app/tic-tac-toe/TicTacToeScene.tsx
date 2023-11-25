"use client"

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import React, { useEffect, useRef, useState } from 'react';
import { Stats, OrbitControls } from '@react-three/drei'; 
import Lines from "./components/Lines";
import Fields from "./components/Field";
import Floor from "./components/Floor";
import { gameValidation }  from "./components/GameValidation"
import Table from "./components/Table";
import FinishLine from "./components/FinishLine";
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { fieldGenerator, gridLineGenrator } from "./components/Grid";

const initialBoardState = [
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
	[
		['', '', ''],
		['', '', ''],
		['', '', ''],
	],
];

const initialSceneCords = [
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
	[
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
		[[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	],
];

const winningCoords = [
	[0, 0, 0],[0, 0, 0],[0, 0, 0]
];

const TTTScene = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [clicked, click] = useState(false);
	const [currentTurn, setTurn] = useState('X');
	const [board, setCurrentBoardState] = useState(initialBoardState);
	const [sceneCords, setSceneCords] = useState(initialSceneCords);
	const [visible, setVisible] = useState(false);
	const [coords, setCoords] = useState(winningCoords);
	const [colour, setColour] = useState(0xffffff)

	const checkClick = () => {
		if (clicked) {
			setTurn(currentTurn == 'X' ? 'O' : 'X');
			click(false);
			const winner = gameValidation(board, sceneCords, coords, setCoords);
			if (winner) {
				setVisible(true);
				winner == 'X' ? setColour(0xff0000) : setColour(0x1aabff);
				console.log(winner);
			}
		}
	}

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
	
		checkClick();
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [clicked]);

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<PerspectiveCamera
					makeDefault
					fov={60}
					aspect={dimensions.width / dimensions.height}
					near={0.1}
					far={1000}
					position={[33, 25, 39]}
				/>
				{gridLineGenrator()}
				{fieldGenerator(clicked, click, currentTurn, board, setCurrentBoardState, sceneCords, setSceneCords)}
				<Floor	position={[ 0,-0.2, 0]}/> 
				<Floor	position={[ 0, 5.8, 0]}/>
				<Floor	position={[ 0, 11.8, 0]}/>
				<FinishLine winningCoords={winningCoords} visible={visible} colour={colour} />
				{/*<Table />*/}
				{/*<gridHelper args={[100, 100]} />*/}
				{/*<Stats/>*/}
				<OrbitControls />
			</Canvas>
		</div>
	)
}

export default TTTScene