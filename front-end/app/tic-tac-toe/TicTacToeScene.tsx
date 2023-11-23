"use client"

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber"
import React, { useEffect, useState } from 'react';
import { Stats, OrbitControls } from '@react-three/drei'; 
import Lines from "./components/Lines";
import Fields from "./components/Fields";
import Floor from "./components/Floor";
import { EffectComposer } from "@react-three/postprocessing";
import  gameValidation  from "./components/GameValidation"

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

const TTTScene = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [clicked, click] = useState(false);
	const [turn, setTurn] = useState('X');
	const [board, setCurrentBoardState] = useState(initialBoardState);

	const turnChange = () => {
		if (turn == 'X')
			setTurn('O');
		else
			setTurn('X');
	}

	const checkClick = () => {
		if (clicked) {
			turnChange();
			click(false);
			console.log(board);
			const winner = gameValidation(board);
			if (winner)
				console.log(winner);
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
					position={[0, 0, 100]}
				/>
				<Lines	position={[ 3, 0, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[-3, 0, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[ 0, 0, 3]}	rotation={[0, 0, Math.PI / 2]} />
				<Lines	position={[ 0, 0, -3]}	rotation={[0, 0, Math.PI / 2]} />
				<Fields	position={[ 0, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={1} k={1}/>
				<Fields position={[-6, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={1} k={0}/>
				<Fields position={[ 6, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={1} k={2}/>
				<Fields	position={[ 0, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={0} k={1}/>
				<Fields position={[-6, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={0} k={0}/>
				<Fields position={[ 6, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={0} k={2}/>
				<Fields position={[ 0, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={2} k={1}/>
				<Fields position={[-6, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={2} k={0}/>
				<Fields position={[ 6, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={0} j={2} k={2}/>
				<Floor	position={[ 0,-0.2, 0]}/> 

				<Lines	position={[ 3, 6, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[-3, 6, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[ 0, 6, 3]}	rotation={[0, 0, Math.PI / 2]} />
				<Lines	position={[ 0, 6, -3]}	rotation={[0, 0, Math.PI / 2]} />
				<Fields position={[ 0, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={1} k={1}/>
				<Fields position={[-6, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={1} k={0}/>
				<Fields position={[ 6, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={1} k={2}/>
				<Fields position={[ 0, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={0} k={1}/>
				<Fields position={[-6, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={0} k={0}/>
				<Fields position={[ 6, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={0} k={2}/>
				<Fields position={[ 0, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={2} k={1}/>
				<Fields position={[-6, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={2} k={0}/>
				<Fields position={[ 6, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={1} j={2} k={2}/>
				<Floor	position={[ 0, 5.8, 0]}/>
		
				<Lines	position={[ 3, 12, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[-3, 12, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[ 0, 12, 3]}	rotation={[0, 0, Math.PI / 2]} />
				<Lines	position={[ 0, 12, -3]}	rotation={[0, 0, Math.PI / 2]} />
				<Fields position={[ 0, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={1} k={1}/>
				<Fields position={[-6, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={1} k={0}/>
				<Fields position={[ 6, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={1} k={2}/>
				<Fields position={[ 0, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={0} k={1}/>
				<Fields position={[-6, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={0} k={0}/>
				<Fields position={[ 6, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={0} k={2}/>
				<Fields position={[ 0, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={2} k={1}/>
				<Fields position={[-6, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={2} k={0}/>
				<Fields position={[ 6, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn} board={board} setCurrentBoardState={setCurrentBoardState} i={2} j={2} k={2}/>
				<Floor	position={[ 0, 11.8, 0]}/>

				{/*<gridHelper args={[100, 100]} />*/}
				<OrbitControls />
				<Stats/>
			</Canvas>
		</div>
	)
}

export default TTTScene

//{/* f0 Middle */}
//{/* f0 MID LEFT */}
//{/* f0 MID RIGHT */}
//{/* f0 TOP MID */}
//{/* f0 TOP LEFT */}
//{/* f0 TOP RIGHT*/}
//{/* f0 BOTTOM MID */}
//{/* f0 BOTTOM LEFT */}
//{/* f0 BOTTOM RIGHT */}