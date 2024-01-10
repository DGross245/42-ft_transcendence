import { PerspectiveCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

interface CameraProps {
	target: [number, number, number],
	keyMap: { [key: string]: boolean },
	reset: boolean,
}

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props -
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera : React.FC<CameraProps>= (props) => {
	const ref = useRef<THREE.PerspectiveCamera>(null);
	const keyMap = props.keyMap;

	// On reset changes back the original position.
	useEffect(() => {
		if (ref && ref.current) {
			if (props.reset) {
				ref.current.position.set(...[43, 33, 52]);
				ref.current.lookAt(...props.target);
			}
		}
	}, [props.reset]);

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	useFrame(() => {
		if (ref && ref.current) {
			if (keyMap['Digit1']) {
				ref.current.position.set(...[43, 33, 52]);
				ref.current.lookAt(...props.target);
			}
		}
		console.log(ref.current?.position);
	});

	return (
		<PerspectiveCamera
			makeDefault
			ref={ref}
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[43, 33, 52]}
		/>
	);
}

export default Camera;