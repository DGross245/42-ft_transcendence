import OneForAllScene from "./oneForAll/OneForAllScene";
import PongScene from "@/app/pong/normal/PongScene";

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<OneForAllScene />
			</div>
		 </div>
	);
}

