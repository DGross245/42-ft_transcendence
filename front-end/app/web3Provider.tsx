"use client"

import { ReactNode, useEffect } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

const projectId = 'e724641375a102581d38c8ee62fc81dd'

const goerli = {
	chainId: 5,
	name: 'goerli',
	currency: 'ETH',
	explorerUrl: 'https://goerli.etherscan.io',
	rpcUrl: 'https://ethereum-goerli.publicnode.com'
}

const metadata = {
	name: 'My Website',
	description: 'My Website description',
	url: 'https://localhost:3000',
	icons: ['https://avatars.mywebsite.com/']
}

// @note typescript workaround to enable type any children prop in Web3ModalProvider component
interface Web3ModalProviderProps {
	children: ReactNode;
}

// @note children is a property ( = parameter) of Web3ModalProvider component,
// it enables the caller to insert arbitrary child child components, making it
// possible for Web3ModalProvider component to act as a wrapper and provide its
// web3modal properties to any component that is passed as a child.
export function Web3ModalProvider({ children }: Web3ModalProviderProps) {
	useEffect(() => {
		createWeb3Modal({
			ethersConfig: defaultConfig({ metadata }),
			chains: [goerli],
			projectId
		});
	  }, []);
	return children;
}