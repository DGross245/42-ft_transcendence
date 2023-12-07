"use client"

import { PerspectiveCamera, useAspect } from "@react-three/drei";
import { Canvas } from "@react-three/fiber"
import React, { useEffect, useRef, useState } from 'react';
import { Stats, OrbitControls } from '@react-three/drei'; 
import Floor from "./components/Floor";
import { gameValidation }  from "./components/GameValidation"
import Table from "./components/Table";
import FinishLine from "./components/FinishLine";
import { EffectComposer, SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'
import * as THREE from 'three'
import { fieldGenerator, gridLineGenrator } from "./components/Grid";
import EndModal from "./components/EndModal";
import { useDisclosure } from "@nextui-org/react";

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
	[-1, -1, -1],[-1, -1, -1],[-1, -1, -1]
];

const TTTScene = (props) => {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [clicked, click] = useState(false);
	const [currentTurn, setTurn] = useState('X');
	const [board, setCurrentBoardState] = useState(initialBoardState);
	const [sceneCords, setSceneCords] = useState(initialSceneCords);
	const [visible, setVisible] = useState(false);
	const [coords, setCoords] = useState(winningCoords);
	const [colour, setColour] = useState(0xffffff)
	const [gameOver, setGameOver] = useState(false);
	const lightRef = useRef()

	const checkClick = () => {
		if (clicked) {
			setTurn(currentTurn == 'X' ? 'O' : 'X');
			click(false);
			const winner = gameValidation(board, sceneCords, coords, setCoords);
			if (winner) {
				setVisible(true);
				winner == 'X' ? setColour(0xff0000) : setColour(0x1aabff);
				onOpen();
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
     			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} ref={lightRef} />
				{gridLineGenrator()}
				{fieldGenerator(lightRef, coords, setCoords, clicked, click, currentTurn, board, setCurrentBoardState, sceneCords, setSceneCords, gameOver)}
				<Floor	position={[ 0,-0.2, 0]}/> 
				<Floor	position={[ 0, 5.8, 0]}/>
				<Floor	position={[ 0, 11.8, 0]}/>
				<FinishLine coords={coords} visible={visible} colour={colour} />
				{/*<Table />*/}
				{/*<gridHelper args={[100, 100]} />*/}
				<OrbitControls />
				<EndModal />
			</Canvas>
		</div> 
	)
}

export default TTTScene;