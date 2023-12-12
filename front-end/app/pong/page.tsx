import { title } from "@/components/primitives";
import PongScene from "@/app/pong/PongScene";
import { StrictMode } from 'react';

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<StrictMode>
					<PongScene />
				</StrictMode>
			</div>
	 	 </div>
	);
}

