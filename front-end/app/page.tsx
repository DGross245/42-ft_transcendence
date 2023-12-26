import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { StrictMode } from 'react';

import Scores from "./scores";

export default function Home() {
	return (
		<StrictMode>
			<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<Scores /> {/* Insert Scores component here */}
			</section>
		</StrictMode>
	);
}
