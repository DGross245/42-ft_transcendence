import { PerspectiveCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props -
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera = (props) => {
	const ref = useRef();
	const keyMap = props.keyMap;

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	useFrame(() => {
		if (keyMap['Digit1']) {
			ref.current.position.set(...props.position);
			ref.current.lookAt(0, 0, 0);
		}
	});

	return (
		<PerspectiveCamera
			makeDefault
			ref={ref}
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={props.position}
		/>
	);
}

export default Camera;