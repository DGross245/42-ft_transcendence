import { title } from "@/components/primitives";
import PongScene from "@/app/pong/normal/PongScene";
import { StrictMode } from 'react';
import OneForAllScene from "./oneForAll/OneForAllScene";

export default function PongPage() {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
			<div>
				<OneForAllScene />
			</div>
	 	 </div>
	);
}

