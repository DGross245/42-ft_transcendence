import { useFrame } from "@react-three/fiber";
import { forwardRef } from "react";
import * as THREE from 'three'

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @param ref - Forwarded reference for more control in parent component.
 * @returns A Three.js mesh representing the paddle.
 */
export const RightPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 105;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (keyMap['ArrowUp']) {
			ref.current.position.y = Math.min(ref.current.position.y + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['ArrowDown']) {
			ref.current.position.y = Math.max(ref.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
		}
	});

	return (
		<mesh ref={ref} {...props}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial
				color={new THREE.Color(16, 16, 16)}
				toneMapped={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
});

/**
 * Creates a Three.js mesh representing the right paddle for the game scene and manages its movement.
 * @returns A Three.js mesh representing the paddle.
 */
export const LeftPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 105;

	// Moves the paddle based on pressed key for each frame.
	useFrame((_, delta) => {
		if (keyMap['KeyW']) {
			ref.current.position.y = Math.min(ref.current.position.y + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['KeyS']) {
			ref.current.position.y = Math.max(ref.current.position.y - paddleSpeed * delta, -borderPositionY + 15);
		}
	});

	return (
		<mesh ref={ref} {...props}>
			<boxGeometry args={[4, 30, 4]} />
			<meshBasicMaterial
				color={new THREE.Color(16, 16, 16)}
				toneMapped={false}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
});