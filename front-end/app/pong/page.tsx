import { title } from "@/components/primitives";
import PongScene from "@/app/pong/normal/PongScene";
import OneForAllScene from "./oneForAll/OneForAllScene";
import { PongProvider } from "./PongProvider";

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<PongProvider>
					<PongScene />
				</PongProvider>
			</div>
		 </div>
	);
}

