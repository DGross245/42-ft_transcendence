"use client"

import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber"
import React, { useEffect, useState } from 'react';
import { Stats, OrbitControls } from '@react-three/drei'; 
import Lines from "./components/Lines";
import Fields from "./components/Fields";
import Floor from "./components/Floor";

const TTTScene = () => {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	const [clicked, click] = useState(false);
	const [turn, setTurn] = useState('X');

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
				<Fields	position={[ 0, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields	position={[ 0, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 0, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 0, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 0, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 0, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Floor	position={[ 0,-0.2, 0]}/>

				<Lines	position={[ 3, 6, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[-3, 6, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[ 0, 6, 3]}	rotation={[0, 0, Math.PI / 2]} />
				<Lines	position={[ 0, 6, -3]}	rotation={[0, 0, Math.PI / 2]} />
				<Fields position={[ 0, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 0, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 0, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 6, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 6, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 6, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Floor	position={[ 0, 5.8, 0]}/>

				<Lines	position={[ 3, 12, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[-3, 12, 0]}	rotation={[Math.PI / 2, 0, 0]} />
				<Lines	position={[ 0, 12, 3]}	rotation={[0, 0, Math.PI / 2]} />
				<Lines	position={[ 0, 12, -3]}	rotation={[0, 0, Math.PI / 2]} />
				<Fields position={[ 0, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 0, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 0, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 12, 0]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 12, 6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[ 6, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Fields position={[-6, 12, -6]}	rotation={[0, 0, Math.PI / 2]} clicked={clicked} click={click} turn={turn}/>
				<Floor	position={[ 0, 11.8, 0]}/>

				<gridHelper args={[100, 100]} />
				<OrbitControls />
				<Stats/>
			</Canvas>
		</div>
	)
}

export default TTTScene