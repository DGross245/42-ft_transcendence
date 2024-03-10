"use client";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { siteConfig } from "@/config/site";

/* -------------------------------------------------------------------------- */
/*                                 Web3Config                                 */
/* -------------------------------------------------------------------------- */
const projectId = 'e724641375a102581d38c8ee62fc81dd'; // @note put this in a .env?

/* -------------------------------- Chain(s) -------------------------------- */
const SepoliaBase = {
	chainId: 84532,
	name: 'SepoliaBase',
	currency: 'SepoliaETH',
	explorerUrl: 'https://sepolia.basescan.org/',
	rpcUrl: 'https://sepolia.base.org'
};

/* ---------------------------------- Modal --------------------------------- */
createWeb3Modal({
	ethersConfig: defaultConfig({ 
		metadata: {
			name: siteConfig.name,
			description: siteConfig.description,
			url: 'https://localhost:3000',
			icons: ['/favicon.ico']
		}
	}),
	chains: [SepoliaBase],
	projectId,
});

const Web3ModalProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
	return (<>{children}</>);
}
export default Web3ModalProvider;
