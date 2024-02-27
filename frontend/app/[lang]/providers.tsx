"use client";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation';
import { siteConfig } from "@/config/site";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

export interface ProvidersProps {
	children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                 Web3Config                                 */
/* -------------------------------------------------------------------------- */
const projectId = 'e724641375a102581d38c8ee62fc81dd'; // @note put this in a .env?

/* -------------------------------- Chain(s) -------------------------------- */
const goerli = {
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
	chains: [goerli],
	projectId,
});

/* -------------------------------------------------------------------------- */
/*                                  Providers                                 */
/* -------------------------------------------------------------------------- */

export function Providers({ children }: ProvidersProps) {
	const router = useRouter();

	return (
		<NextUIProvider navigate={router.push} className="h-screen">
			{children}
		</NextUIProvider>
	);
}