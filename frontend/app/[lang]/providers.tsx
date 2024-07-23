"use client";

import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation';
import Web3ModalProvider from './web3modal';
import { GuestProvider } from "./guestProvider";

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
				<GuestProvider>
					{children}
				</GuestProvider>
			</Web3ModalProvider>
	  	</NextUIProvider>
	);
}
