"use client";

import { useWeb3Modal, useWeb3ModalState, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { Button, ButtonProps } from "@nextui-org/button";
import { useTranslation } from "@/app/i18n";
import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface CustomW3ButtonProps {
	size?: ButtonProps["size"];
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const CustomW3Button: React.FC<CustomW3ButtonProps> = ({ size = "md" }) => {
	const { open: modalOpen } = useWeb3ModalState();
	const { isConnected } = useWeb3ModalAccount();
	const { open: openModal } = useWeb3Modal();
	const { t } = useTranslation("w3button");
	const [update, setUpdate] = useState(false);
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		setConnected(isConnected);
	}, [isConnected]);

	useEffect(() => {
		setUpdate(true);
	}, [t])

	const connecting = !connected && modalOpen;

	return (
		<>
			<div hidden={!connected}>
				<w3m-account-button/>
			</div>
			<div hidden={connected}>
				<Button
					size={size}
					color="primary"
					variant="shadow"
					className="ghost-button gradient !border-0"
					onClick={() => openModal()}
					isLoading={connecting}
				>
					{connecting ? t("connecting") : t("connectwallet")}
				</Button>
			</div>
		</>
	);
}

export default CustomW3Button;
