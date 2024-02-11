"use client";

import { Navbar as NextUINavbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter, usePathname } from 'next/navigation';

import LanguageSelectionButton from "./LanguageSelectionButton";
import CustomW3Button from "./CustomW3Button";
import IconButton from "./IconButton";

import i18nConfig from "@/i18n.config";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

export const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const previousRoutes = (pathname && pathname[(pathname?.length ?? 1) - 1] !== "/" && !(i18nConfig.locales.some(substring => pathname.endsWith(substring))));

	return (
		<NextUINavbar maxWidth="xl" position="sticky" className="absolute">
			<NavbarContent justify="start">
				{previousRoutes && <IconButton onClick={() => router.replace("/")}>
					<ArrowLeftIcon color="white" className="w-10"/>
				</IconButton>}
			</NavbarContent>

			<NavbarContent justify="end">
				<NavbarItem>
					<CustomW3Button />
				</NavbarItem>
				<NavbarItem>
					<LanguageSelectionButton />
				</NavbarItem>
			</NavbarContent>
		</NextUINavbar>
	);
};
