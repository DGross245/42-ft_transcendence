"use client"

import * as THREE from 'three';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, } from '@react-three/fiber';
import { Stats, MeshReflectorMaterial, PerspectiveCamera, OrbitControls } from '@react-three/drei'; 
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import InputHandler from './hooks/InputHandler';

const Camera = () => {
	return (
		<PerspectiveCamera
			makeDefault
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[0, 0, 300]}
		/>
	)
}

const Border = ({ position }: { position: [number, number, number] }) => {
	return (
		<mesh position={position}>
			<boxGeometry args={[306, 4, 4]}/>
			<meshBasicMaterial
				color={ 0xffffff }
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
				/>
		</mesh>
	)
}

const RightPaddle = (props) => {
	const keyMap = props.keyMap;
	const ref = useRef<Mesh>(null!);
	const paddleSpeed = 300;
	const borderPositionY = 105;

	useFrame((_, delta) => {
		if (keyMap['ArrowUp']) {
			ref.current.position.y = Math.min(ref.current.position.y + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['ArrowDown']) {
			ref.current.position.y = Math.max(ref.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
		}
	})

	return (
		<mesh ref={ref} {...props}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial
				color={0xffffff}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	)
}

const LeftPaddle = (props) => {
	const keyMap = props.keyMap;
	const ref = useRef<Mesh>(null!);
	const paddleSpeed = 300;
	const borderPositionY = 105;

	useFrame((_, delta) => {
		if (keyMap['KeyW']) {
			ref.current.position.y = Math.min(ref.current.position.y + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['KeyS']) {
			ref.current.position.y = Math.max(ref.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
		}
	})

	return (
		<mesh ref={ref} {...props}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial
				color={0xffffff}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	)
}

const Ball = () => {
	const ref = useRef<Mesh>(null);
	return (
		<mesh ref={ref}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial
				color={ 0xffffff }
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	)
}

const MultipleCubeLine = () => {
	const cubeGeometry = new BoxGeometry(3, 3, 0.5);
	const cubeMaterial = new MeshBasicMaterial({ color: 0x808080 });
	const cubes = [];
  
	for (let i = 0; i < 20; i++) {
	  const positionY = i * (105 * 2) / 20 - 105;
	  const cube = (
		<mesh key={i} geometry={cubeGeometry} material={cubeMaterial} position={[0, positionY, -4]} />
	  );
	  cubes.push(cube);
	}
  
	return (
		<group>
			{cubes}
		</group>
	)
}

const GroundReflection = () => {
	return (
		<>
			<mesh position={[0, 0, -4]}>
				<planeGeometry args={[360, 230]}/>
					<MeshReflectorMaterial
						mirror={0.1}
						blur={[200, 100]}
						resolution={1000}
						mixBlur={1}
						mixStrength={60}
						roughness={1}
						depthScale={1.2}
						minDepthThreshold={0.6}
						maxDepthThreshold={1.4}
						color="#151515"
						metalness={0.5}
					/>
			</mesh>
			<mesh>
				<planeGeometry args={[360, 230]}/>
				<meshBasicMaterial
					color={ 0x111111 }
					transparent={true}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
		</>
	)
}

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
				<MultipleCubeLine />
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
