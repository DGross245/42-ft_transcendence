"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import GameModal, { GameResult } from "./GameModal";
import CustomizeModal from "./CutomizeModal";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { useFrame, useLoader } from "@react-three/fiber";
// import { useRef } from "react";

// const WinnerModel = () => {
// 	const winnerGLTF = useLoader(GLTFLoader, '/gltfs/winner.gltf');
// 	const winnerRef = useRef<any>();

// 	useFrame(() =>{
// 		if (winnerRef && winnerRef.current){
// 			winnerRef.current.rotation.y += 0.005;
// 			winnerRef.current.position.y = -1
// 		}
// 	})

// 	return (
// 		<group ref={winnerRef}>
// 			{winnerGLTF.scene && <primitive object={winnerGLTF.scene} />}
// 		</group>
// 	)
// }

export default function Home() {
	const {isOpen, onOpen, onOpenChange} = useDisclosure();

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
			<GameModal isOpen={isOpen} gameResult={GameResult.Paused} resume={() => {}}/>
			<Button onPress={onOpen}>Open Modal</Button>
			{/* <CustomizeModal isOpen={isOpen} loading={false}/>
			<Button onPress={onOpen}>Open Modal</Button> */}
		</section>
	)
}
