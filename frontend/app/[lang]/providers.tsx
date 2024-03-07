"use client";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation';
import { siteConfig } from "@/config/site";
import Web3ModalProvider from './web3modal';

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
export interface ProvidersProps {
	children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                  Providers                                 */
/* -------------------------------------------------------------------------- */

export function Providers({ children }: ProvidersProps) {
	const router = useRouter();

	return (
		<NextUIProvider navigate={router.push} className="h-screen">
				<Web3ModalProvider>
				{children}
		</Web3ModalProvider>
			</NextUIProvider>
	);
}
