import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";

import favicon from "@/assets/favicon.ico";
import logo from "@/assets/logo.png";

import "@/styles/globals.css";

/* -------------------------------------------------------------------------- */
/*                                    Meta                                    */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: favicon.src,
		shortcut: logo.src,
		apple: logo.src,
	},
};

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={clsx(
					"font-sans antialiased",
					fontSans.className
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<Navbar />
					<main className="mx-auto max-w-7xl pt-16 px-6 h-full">
						{children}
					</main>
				</Providers>
			</body>
		</html>
	);
}
