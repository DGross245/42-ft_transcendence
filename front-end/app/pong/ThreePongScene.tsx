"use client"

import * as THREE from 'three';
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, } from '@react-three/fiber'
import { MeshReflectorMaterial, PerspectiveCamera, OrbitControls } from '@react-three/drei'; 
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import useKeyboard from './hooks/useKeyboard';

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
	);
};

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

const Paddle = (props) => {
	const leftRef = useRef()
	const rightRef = useRef()
	const keyMap = props.keyMap

	const [leftSelected, setLeftSelected] = useState(false)
	const [rightSelected, setRightSelected] = useState(false)
  
	useFrame((_, delta) => {
	  if (leftSelected) {
		keyMap['KeyW'] && (leftRef.current.position.y += 100 * delta)
		keyMap['KeyS'] && (leftRef.current.position.y -= 100 * delta)
	  }
  
	  if (rightSelected) {
		keyMap['ArrowUp'] && (rightRef.current.position.y -= 100 * delta)
		keyMap['ArrowDown'] && (rightRef.current.position.y -= 100 * delta)
	  }
	})

	return (
		<>
			<mesh ref={leftRef} position={[-150, 0, 0]} onPointerDown={() => setLeftSelected(!leftSelected)}>
				<boxGeometry args={[4, 30, 4]} />
				<meshBasicMaterial
					color={0xffffff}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh ref={rightRef} position={[150, 0, 0]} onPointerDown={() => setRightSelected(!rightSelected)}>
				<boxGeometry args={[4, 30, 4]} />
				<meshBasicMaterial
					color={0xffffff}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
		</>
	);
};

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
	const cubeGeometry = new BoxGeometry(2, 2, 0.5);
	const cubeMaterial = new MeshBasicMaterial({ color: 0x808080 });
	const cubes = [];
  
	for (let i = 0; i < 20; i++) {
	  const positionY = i * (105 * 2) / 20 - 105;
	  const cube = (
		<mesh key={i} geometry={cubeGeometry} material={cubeMaterial} position={[0, positionY, -4]} />
	  );
	  cubes.push(cube);
	}
  
	return <group>{cubes}</group>;
};

const GroundReflection = () => {
	return (
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
	);
};

export default function ThreePongScene() {
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const keyMap = useKeyboard()

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
				{/* <Camera /> */}
				<ambientLight />
				<pointLight position={[10, 10, 10]} />
				<Border position={[0,105,0]} />
				<Border position={[0,-105,0]} />
				{/* <Paddle position={[-150, 0, 0]} keyMap={keyMap} />
				<Paddle position={[150, 0, 0]}  keyMap={keyMap} /> */}
				<Paddle leftKey={keyMap['KeyW']} rightKey={keyMap['ArrowUp']} />
				<Ball />
				<MultipleCubeLine />
				<GroundReflection />
				<mesh>
					<planeGeometry args={[360, 230]}/>
					<meshBasicMaterial
						color={ 0x111111 }
						transparent={true}
						blending={THREE.AdditiveBlending}
						side={THREE.BackSide}
					/>
				</mesh>
				<EffectComposer>
					<Bloom
						mipmapBlur
						luminanceThreshold={0}
						intensity={0.5}
						radius={0.72}
					/>
				</EffectComposer>
				<OrbitControls />
			</Canvas>
		</div>
	)
}
