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
					<div className="flex flex-col h-full">
						<Navbar />
						<main className="flex-grow">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
