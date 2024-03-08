import { ToastContainer } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Metadata } from "next";
import clsx from "clsx";

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

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
interface LangLayoutProps {
	children: React.ReactNode;
	params: {locale: string};
}

/* -------------------------------------------------------------------------- */
/*                                 LangLayout                                 */
/* -------------------------------------------------------------------------- */
const LangLayout: React.FC<LangLayoutProps> = ({children, params: {locale}}) => {
	// dir={dir(locale)}
	return (
		<html lang={locale}>
			<body
				className={clsx(
					"font-sans antialiased dark text-foreground bg-background",
					fontSans.className
				)}
			>
				<Providers>
					<ToastContainer
						position="bottom-right" 
					/>
					<div className="flex flex-col h-full">
						<Navbar />
						<main className="flex-grow" style={{ marginTop: '4rem' }}>
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}

export default LangLayout;
