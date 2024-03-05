"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef } from "react";
import { Html } from '@react-three/drei';

import { useTranslation } from "../i18n";
import { useWindow } from "@/components/hooks/useWindow";

const Wallet = () => {
	const walletGLTF = useLoader(GLTFLoader, '/Models/wallet/scene.gltf');
	const walletRef = useRef<any>();

	useFrame((_, delta) =>{
		if (walletRef && walletRef.current){
			walletRef.current.rotation.y += 0.5 * delta;
			walletRef.current.position.y = 1.5
		}
	})

	return (
		<group ref={walletRef}>
			{walletGLTF.scene && <primitive object={walletGLTF.scene} />}
		</group>
	)
}

interface TextProps {
	leftTitle: string;
	rightTitle: string;
}

const Text = ({leftTitle, rightTitle}: TextProps) => {
	return (<>
		<Html position={[-3, 0, 0]} style={{ width: '1000px' }} className="text-white text-start text-6xl font-sans font-bold" zIndexRange={[-20]}>
			{leftTitle}
		</Html>
		<Html position={[-0.5, -0.7, 0]} style={{ width: '1000px' }} className="text-transparent bg-clip-text bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] text-5xl font-semibold tracking-tight inline" zIndexRange={[-20]}>
			{rightTitle}
		</Html>
	</>)
}

export const WalletScene = () => {
	const { dimensions } = useWindow();
	const { t } = useTranslation("common");

	return (
		<div style={{ width: '100%', height: '100%', zIndex: -1 }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<ambientLight intensity={0.4} />
				<pointLight position={[0, 3, 0]} intensity={10} color="white" />
				<Wallet />
				<Text leftTitle={t("ready_to_play")} rightTitle={t("connect_wallet")}/>
				<gridHelper position={[0,-1,0]} args={[200,200]} />
			</Canvas>
		</div>
	);
}