"use client";

import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

import pongGameImage from "@/assets/pongGame.png";
import tttGameImage from "@/assets/tttGame.png";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

interface GameCardProps {
	title: string;
	image: StaticImageData;
	path: string;
}

const GameCard: React.FC<GameCardProps> = ({title, image, path}) => {
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
	const { isConnected } = useWeb3ModalAccount();

	if (!isConnected) {
		return (
			<section className="flex flex-col items-center justify-center h-full">
				<div className="flex flex-col text-center">
					<p style={{fontSize: '120px', verticalAlign: 'middle'}}>🪪</p>
					<p className="font-bold text-xl">🕹️ Please connect your Wallet to play 🕹️</p>
				</div>
			</section>
		);
	}

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
			<GameCard
				title="❌ Tic Tac Toe (3D) ⭕️"
				image={tttGameImage}
				path="/tic-tac-toe"
			/>
			<GameCard
				title="🏓 Pong (3D) 🏓"
				image={pongGameImage}
				path="/pong"
			/>
            {/* <WSClient /> */}
		</section>
	);
}
