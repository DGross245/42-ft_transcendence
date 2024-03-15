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
import PongGame from "./pong/page";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

interface GameCardProps {
	title: string;
	image: StaticImageData;
	path: string;
}

export const GameCard: React.FC<GameCardProps> = ({title, image, path}) => {
	const router = useRouter();

	return (
		<Card className="py-4 max-w-[600px] cursor-pointer" isHoverable isPressable onPress={() => router.replace(path)}>
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
	// const [game, setGame] = useState("HOME");

	// if (game === "Pong") {
	// 	return (
	// 		<section className="flex-col items-center justify-center h-full" hidden={game !== "Pong"}>
	// 			<PongGame />
	// 		</section>
	// 	);
	// } else if (game === "TTT") {
	// 	return (

	// 	);
	// }
	return (
		<section className="flex-col items-center justify-center h-full">
			<WalletScene />
		</section>
	);
}
