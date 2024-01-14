"use client";

import { Navbar as NextUINavbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter, usePathname } from 'next/navigation';

import CustomW3Button from "./CustomW3Button";
import IconButton from "./IconButton";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const previousRoutes = (pathname !== "/" || pathname.length == 0);

	return (
		<NextUINavbar maxWidth="xl" position="static">
			<NavbarContent justify="start">
				{previousRoutes && <IconButton onClick={() => router.replace("/")}>
					<ArrowLeftIcon color="white" className="w-10"/>
				</IconButton>}
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<CustomW3Button />
				</NavbarItem>
			</NavbarContent>
		</NextUINavbar>
	);
};
