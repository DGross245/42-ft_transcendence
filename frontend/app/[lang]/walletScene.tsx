"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useRef, useState } from "react";
import { Html } from '@react-three/drei';

import { useTranslation } from "../i18n";
import { useWindow } from "@/components/hooks/useWindow";
import { GameCard } from "./page";
import pongGameImage from "@/assets/pongGame.png";
import tttGameImage from "@/assets/tttGame.png";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
const Wallet = () => {
	const walletGLTF = useLoader(GLTFLoader, '/Models/wallet/scene.gltf');
	const walletRef = useRef<any>();

	useFrame((_, delta) =>{
		if (walletRef && walletRef.current){
			walletRef.current.rotation.y += 0.5 * delta;
			walletRef.current.position.y = 1;
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
		<Html position={[-3, -0.4, 0]} style={{ width: '1000px' }} className="text-white text-start text-6xl font-sans font-bold" zIndexRange={[-20]}>
			{leftTitle}
		</Html>
		<Html position={[-0.5, -1.1, 0]} style={{ width: '1000px' }} className="text-transparent bg-clip-text bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] text-5xl font-semibold tracking-tight inline" zIndexRange={[-20]}>
			{rightTitle}
		</Html>
	</>)
}

interface WalletSceneProps {
	setGame: React.Dispatch<React.SetStateAction<string>>;
}

export const WalletScene: React.FC<WalletSceneProps> = ({ setGame }) => {
	const [connected, setConnected] = useState(false);
	const { dimensions } = useWindow();
	const { t } = useTranslation("common");
	const { isConnected } = useWeb3ModalAccount();

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	if (!connected) {
		return (
			<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
				<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
					<ambientLight intensity={0.4} />
					<pointLight position={[0, 2.5, 0]} intensity={10} color="white" />
					<Wallet />
					<Text leftTitle={t("ready_to_play")} rightTitle={t("connect_wallet")} />
					<gridHelper position={[0, -1, 0]} args={[200, 200]} />
				</Canvas>
			</div>
		)
	}

	return (
		<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
			<Canvas style={{ width: dimensions.width, height: dimensions.height }}>
				<gridHelper position={[0, -1, 0]} args={[200, 200]} />
			</Canvas>
			<div className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
				<GameCard
					title={t('ttt')}
					image={tttGameImage}
					setGame={() => setGame('TTT')}
					path="/tic-tac-toe"
				/>
				<GameCard
					title={t('pong')}
					image={pongGameImage}
					setGame={() => setGame('Pong')}
					path="/pong"
				/>
			</div>
		</div>
	);
}