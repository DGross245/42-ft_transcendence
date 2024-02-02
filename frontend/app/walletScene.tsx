"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
// import { useWindow } from "./tic-tac-toe/hook/useWindow";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useRef, useState } from "react";
import { Html } from '@react-three/drei';
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/react";

const Wallet = () => {
	const walletGLTF = useLoader(GLTFLoader, '/wallet/scene.gltf');
	const walletRef = useRef<any>();

	useFrame(() =>{
		if (walletRef && walletRef.current){
			walletRef.current.rotation.y += 0.005;
			walletRef.current.position.y = 1.5
		}
	})

	return (
		<group ref={walletRef}>
			{walletGLTF.scene && <primitive object={walletGLTF.scene} />}
		</group>
	)
}
 
const Text = () => {
	return (
		<>
			<Html position={[-3, 0, 0]} style={{ width: '500px' }} className="text-white text-6xl font-sans font-bold flex justify-center items-center">
				Ready to Play?
			</Html>
			<Html position={[-0.5, -0.7, 0]} style={{ width: '700px' }} className="text-transparent bg-clip-text bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] text-5xl font-semibold tracking-tight inline">
				Connect your Wallet!
			</Html>
			<Html position={[-0.65, -1.8, 0]}>
				<Tooltip showArrow color={"primary"} content={"Click on the top right Button"} className="capitalize">
					<Button size="lg" variant="ghost" className="ghost-button gradient">
						How to connect?
					</Button>
				</Tooltip>
			</Html>
		</>
	)
}

export const WalletScene = () => {
	// const { dimensions } = useWindow(); // TODO: Change back to useWindow after merge
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Updates window dimensions on window resizing
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return (() => {
			window.removeEventListener('resize', handleResize);
		});
	}, []);

	return (
		<div style={{ width: '100%', height: '100%', zIndex: 0 }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<ambientLight intensity={0.4} />
				<pointLight position={[0, 3, 0]} intensity={10} color="white" />
				<Wallet />
				<Text />
				<gridHelper position={[0,-1,0]} args={[200,200]} />
			</Canvas>
		</div>
	);
}