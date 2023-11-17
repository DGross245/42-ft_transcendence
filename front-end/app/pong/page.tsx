import { title } from "@/components/primitives";
import ThreePongScene from "./ThreePongScene";

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<h1 className={title()}>Pong</h1>
					<ThreePongScene />
			</div>
	 	 </div>
	);
}

