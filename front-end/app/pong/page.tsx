import { title } from "@/components/primitives";
import ThreeScene from "@/components/ThreeScene";

export default function PongPage() {
	return (
		<div>
			<h1 className={title()}>Pong</h1>
				<ThreeScene />
		</div>
	);
}
