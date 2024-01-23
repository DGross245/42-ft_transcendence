import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";

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
	icons: siteConfig.icons
};

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface RootLayoutProps {
	children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                    Root                                    */
/* -------------------------------------------------------------------------- */

const RootLayout: React.FC<RootLayoutProps> = ({children}) => {
	return (
		<html lang="en">
			<body
				className={clsx(
					"font-sans antialiased dark text-foreground bg-background",
					fontSans.className
				)}
			>
				<Providers>
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

export default RootLayout;
