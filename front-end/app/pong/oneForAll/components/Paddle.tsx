import { useFrame } from "@react-three/fiber";
import { forwardRef } from "react";
import * as THREE from 'three'

export const RightPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 110;

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

export const LeftPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 110;

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

export const TopPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 110;

	useFrame((_, delta) => {
		if (keyMap['KeyD']) {
			ref.current.position.x = Math.min(ref.current.position.x + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['KeyA']) {
			ref.current.position.x = Math.max(ref.current.position.x - paddleSpeed * delta, -borderPositionY + 15);
		}
	});

	return (
		<mesh ref={ref} {...props} rotation={[0, 0, Math.PI / 2]}>
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

export const BottomPaddle = forwardRef((props, ref) => {
	const keyMap = props.keyMap;
	const paddleSpeed = 300;
	const borderPositionY = 110;

	useFrame((_, delta) => {
		if (keyMap['ArrowRight']) {
			ref.current.position.x = Math.min(ref.current.position.x + paddleSpeed * delta, borderPositionY - 15);
		} else if (keyMap['ArrowLeft']) {
			ref.current.position.x = Math.max(ref.current.position.x - paddleSpeed * delta, -borderPositionY + 15);
		}
	});

	return (
		<mesh ref={ref} {...props} rotation={[0, 0, Math.PI / 2]} >
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