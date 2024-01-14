import Scores from "./tournamentManager";
import WSClient from "./websocketsClient";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

// @todo add text if no wallet is connected

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<Scores />
            <WSClient />
		</section>
	);
}
