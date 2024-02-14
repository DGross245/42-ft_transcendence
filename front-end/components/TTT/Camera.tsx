import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef } from "react";

import { useGameState } from "../../app/tic-tac-toe/hooks/useGameState";
import { useKey } from "@/components/hooks/useKey";

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props -
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera = () => {
	const ref = useRef<THREE.PerspectiveCamera>(null);
	const { gameState } = useGameState();

	const keyOne = useKey('1');

	// On reset changes back the original position.
	useEffect(() => {
		if (ref && ref.current) {
			if (gameState.reset) {
				ref.current.position.set(44, 35, 47);
				ref.current.lookAt(3, 11.8, 3);
			}
		}
	}, [gameState.reset]);

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	useEffect(() => {
		if (ref && ref.current) {
			if (keyOne.isKeyDown) {
				ref.current.position.set(44, 35, 47);
				ref.current.lookAt(3, 11.8, 3);
			}
		}
	},[keyOne])

	return (
		<>
			<PerspectiveCamera
				makeDefault
				ref={ref}
				fov={60}
				aspect={window.innerWidth / window.innerHeight}
				near={0.1}
				far={1000}
				position={[44, 35, 47]}
			/>
			<OrbitControls
				makeDefault
				enableZoom={false}
				target={[3, 11.8, 3]}
				enableRotate={gameState.pause ? false :true}
				enablePan={false}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 2}
			/>
		</>
	);
}

export default Camera;