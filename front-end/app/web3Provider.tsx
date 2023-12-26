"use client"

import React, { ReactNode } from 'react';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

const projectId = 'YOUR_PROJECT_ID'

const goerli = {
    chainId: 5,
    name: 'Goerli',
    currency: 'ETH',
    explorerUrl: 'https://goerli.etherscan.io',
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
}

const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com',
    icons: ['https://avatars.mywebsite.com/']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [goerli],
    projectId
})

// @note typescript workaround to enable type any children prop in Web3ModalProvider component
interface Web3ModalProviderProps {
    children: ReactNode;
}

// @note children is a property ( = parameter) of Web3ModalProvider component,
// it enables the caller to insert arbitrary child child components, making it
// possible for Web3ModalProvider component to act as a wrapper and provide its
// web3modal properties to any component that is passed as a child.
export function Web3ModalProvider({ children }: Web3ModalProviderProps) {
    return children;
}