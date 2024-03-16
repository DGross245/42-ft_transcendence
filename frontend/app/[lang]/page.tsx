"use client";

import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import pongGameImage from "@/assets/pongGame.png";
import tttGameImage from "@/assets/tttGame.png";
import { WalletScene } from "./walletScene";
import { useTranslation } from "../i18n";
import Pong from "./pong/page";
import TicTacToe from "./tic-tac-toe/page";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

interface GameCardProps {
	title: string;
	image: StaticImageData;
	path: string;
	setGame: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({title, image, path, setGame}) => {
	const router = useRouter();

	const handleClick = () => {
		setGame();
		router.push(path);
	};

	return (
		<Card className="py-4 max-w-[600px] cursor-pointer" isHoverable isPressable onPress={handleClick}>
			<CardHeader className="flex-col items-center">
				<h4 className="font-bold text-3xl">{title}</h4>
			</CardHeader>
			<CardBody className="overflow-visible py-2">
				<Image
					alt={title}
					className="object-cover rounded-xl w-auto h-auto"
					src={image}
					width={525}
					priority
				/>
			</CardBody>
		</Card>
	);
}

export default function Home() {
	const [game, setGame] = useState("HOME");
	const { isConnected } = useWeb3ModalAccount();

	// if (game === "Pong" && isConnected) {
	// 	return (
	// 		<section className="flex-col items-center justify-center h-full" hidden={game !== "Pong"}>
	// 			<Pong />
	// 		</section>
	// 	);
	// } 
	// else if (game === "TTT" && isConnected) {
	// 	return (
	// 		<section className="flex-col items-center justify-center h-full" hidden={game !== "TTT"}>
	// 			<TicTacToe />
	// 		</section>
	// 	);
	// }

	return (
		<section className="flex-col items-center justify-center h-full">
			<WalletScene setGame={setGame} />
		</section>
	);
}
