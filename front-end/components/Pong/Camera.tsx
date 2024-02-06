import { PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef } from "react";
import * as THREE from 'three'

import { useKey } from "../hooks/useKey";
import { usePongGameState } from "@/app/pong/hooks/usePongGameState";

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `keyMap` and `position`. 
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera = () => {
	const ref = useRef<THREE.PerspectiveCamera>(null);
	const { camPos } = usePongGameState();
	const [x, y, z] = [...camPos];

	const digit1 = useKey(['1']);
	const digit2 = useKey(['2']);

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	useEffect(() => {
		if (ref && ref.current) {
			if (digit1.isKeyDown) {
				ref.current.position.set(...camPos);
				ref.current.lookAt(0, 0, 0);
			}
			// for testing
			if (digit2.isKeyDown) {
				const [x, y, z] = [...camPos];
				ref.current.position.set(x, y, z + 300);
				ref.current.lookAt(0, 0, 0);
			}
		}
	},[digit1])

	return (
		<PerspectiveCamera
			makeDefault
			ref={ref}
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[x, y, z]}
		/>
	);
}

export default Camera;