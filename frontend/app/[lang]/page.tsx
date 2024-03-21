"use client";

import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import pongGameImage from "@/assets/pongGame.png";
import tttGameImage from "@/assets/tttGame.png";
import { WalletScene } from "./walletScene";
import { useTranslation } from "../i18n";

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
		<Card className="py-4 max-w-[600px] cursor-pointer" isHoverable isPressable onPress={() => router.push(path)}>
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
	const [connected, setConnected] = useState(false);
	const { isConnected } = useWeb3ModalAccount();
	const { t } = useTranslation("common");

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	if (!connected) {
		return (
			<section className="flex-col items-center justify-center h-full" hidden={connected}>
				<WalletScene />
			</section>
		)
	}

	return (
		<section className="flex gap-5 items-center justify-center h-full p-5 flex-wrap md:flex-nowrap">
			<GameCard
				title={t('ttt')}
				image={tttGameImage}
				path="/tic-tac-toe"
			/>
			<GameCard
				title={t('pong')}
				image={pongGameImage}
				path="/pong"
			/>
		</section>
	);
}
