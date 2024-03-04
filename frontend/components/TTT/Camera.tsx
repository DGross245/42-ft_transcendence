import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef } from "react";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";

import { useGameState } from "../../app/[lang]/tic-tac-toe/hooks/useGameState";
import { useKey } from "@/components/hooks/useKey";
import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props -
 * @returns The PerspectiveCamera component from the Three.js library.
 */
const Camera = () => {
	//* ------------------------------- ref & hooks ------------------------------ */
	const ref = useRef<THREE.PerspectiveCamera>(null);
	const { gameState, started } = useGameState();
	const { playerState } = useSocket();
	const keyOne = useKey('1');

	//* ------------------------------- useEffects ------------------------------ */

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
			if (!gameState.pause) {
				if (keyOne.isKeyDown && started) {
					ref.current.position.set(44, 35, 47);
					ref.current.lookAt(3, 11.8, 3);
				}
			}
		}
	},[keyOne, started, gameState.pause])

	//* ------------------------------- render loop ------------------------------ */
	useFrame((_, delta) => {
		if (ref.current && playerState.client !== -1 && !started) {
			const targetPos = new THREE.Vector3(44, 35, 47);
			ref.current.position.lerp(targetPos, 1.6 * delta);
		}
	});

	return (
		<>
			<PerspectiveCamera
				makeDefault
				ref={ref}
				fov={60}
				aspect={window.innerWidth / window.innerHeight}
				near={0.1}
				far={1000}
				position={[75, 30, 66]}
			/>
			<OrbitControls
				makeDefault
				enableZoom={false}
				target={[3, 11.8, 3]}
				enableRotate={started ? true : false}
				enablePan={false}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 2}
			/>
		</>
	);
}

export default Camera;