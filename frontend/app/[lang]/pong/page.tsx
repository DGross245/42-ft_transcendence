import OneForAllScene from "./oneForAll/OneForAllScene";
import { PongProvider } from "./normal/PongProvider";
import PongScene from "@/app/[lang]/pong/normal/PongScene";

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

