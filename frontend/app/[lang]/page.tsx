"use client";

import { useContext, useState } from "react";

import { WalletScene } from "./walletScene";
import guestContext from "./guestProvider";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export default function Home() {
	const [game, setGame] = useState("HOME");
	const { isGuest, updateData } = useContext(guestContext);

	return (
		<section className="flex-col items-center justify-center h-full">
			<WalletScene setGame={setGame} isGuest={isGuest} updateData={updateData} />
		</section>
	);
}
