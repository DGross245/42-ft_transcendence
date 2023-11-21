import { useFrame } from "@react-three/fiber";
import { forwardRef } from "react";
import * as THREE from 'three'

export const RightPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 105;

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
				color={0xffffff}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
});

export const LeftPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 105;

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
				color={0xffffff}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
});