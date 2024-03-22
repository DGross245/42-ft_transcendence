"use client";

import { useState } from "react";

import { WalletScene } from "./walletScene";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function Home() {
	const [game, setGame] = useState("HOME");
	// const { isConnected } = useWeb3ModalAccount();

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
