"use client"

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls } from '@react-three/drei'; 
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import InputHandler from './hooks/InputHandler';
import Camera from './components/Camera';
import Border from './components/Border';
import { RightPaddle, LeftPaddle } from './components/Paddle';
import Ball from './components/Ball';
import CubeLine from './components/CubeLine';
import GroundReflection from './components/GroundReflection';

export default function ThreePongScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = InputHandler()

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div style={{ width: '100%', height: '100%' }}>
		  <Canvas style={{ width: dimensions.width, height: dimensions.height }} camera={{ position: [0, 0, 300] }}>
				{/*<Camera />*/}
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Border position={[0,105,0]} />
				<Border position={[0,-105,0]} />
				<RightPaddle position={[151, 0, 0]} keyMap={keyMap} />
				<LeftPaddle position={[-151, 0, 0]} keyMap={keyMap} />
				<Ball />
				<CubeLine />
				<GroundReflection />
				<EffectComposer>
					<Bloom
						mipmapBlur
						luminanceThreshold={0}
						intensity={0.5}
						radius={0.72}
					/>
				</EffectComposer>
				<OrbitControls />
				<Stats />
			</Canvas>
		</div>
	)
}
