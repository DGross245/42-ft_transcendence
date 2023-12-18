import { PerspectiveCamera } from "@react-three/drei"
import { useThree } from "@react-three/fiber";
import { useRef } from "react";

const Camera = () => {
	return (
		<mesh>
			<PerspectiveCamera
				makeDefault
				fov={60}
				aspect={window.innerWidth / window.innerHeight}
				near={0.1}
				far={1000}
				position={[0, -100, 300]}
			/>
		</mesh>
	);
}

export default Camera