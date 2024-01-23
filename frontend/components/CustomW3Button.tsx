"use client";

import { useWeb3Modal, useWeb3ModalState, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Button } from "@nextui-org/button";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const CustomW3Button: React.FC = () => {
	const { open: modalOpen } = useWeb3ModalState();
	const { isConnected } = useWeb3ModalAccount();
	const { open: openModal } = useWeb3Modal();

	const connecting = !isConnected && modalOpen;

	if (isConnected) {
		return (
			<w3m-account-button/>
		)
	}

	return (
		<Button size="lg" color="primary" variant="shadow" onClick={() => openModal()} isLoading={connecting}>
			{connecting ? "Connecting..." : "Connect Wallet"}
		</Button>
	);
}

export default CustomW3Button;
