import { title } from "@/components/primitives";
import PongScene from "@/app/pong/PongScene";

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<h1 className={title()}>Pong</h1>
					<PongScene />
			</div>
	 	 </div>
	);
}

