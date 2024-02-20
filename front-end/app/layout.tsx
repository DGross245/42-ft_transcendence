import { ToastContainer } from "react-toastify";
import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";

import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	//themeColor: [
	//	{ media: "(prefers-color-scheme: light)", color: "white" },
	//	{ media: "(prefers-color-scheme: dark)", color: "black" },
	//],
	//icons: {
	//	icon: "/favicon.ico",
	//	shortcut: "/favicon-16x16.png",
	//	apple: "/apple-touch-icon.png",
	//},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<ToastContainer
						position="bottom-right" 
					/>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
							{children}
						</main>
						<footer className="w-full flex items-center justify-center py-3">
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
