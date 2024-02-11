import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface PaddleProps {
	movementSpeed?: number;
	color?: THREE.Color;
	x: number;
	y: number;
	rotated?: boolean;
}

export interface PaddleRef {
	setX: (update: ((prevX: number) => number)) => void;
  	setY: (update: ((prevY: number) => number)) => void;
}

/* -------------------------------------------------------------------------- */
/*                                    Body                                    */
/* -------------------------------------------------------------------------- */
const Paddle = forwardRef<PaddleRef, PaddleProps>(({ movementSpeed = 10, color, x, y, rotated = false }, ref) => {
	const [position, setPosition] = useState({ x, y });
	const meshRef = useRef<THREE.Mesh | null>(null);

	/* ------------------------ expose updates to parent ------------------------ */
	useImperativeHandle(ref, () => ({
		setX: (update) => setPosition(prev => ({ ...prev, x: update(prev.x) })),
		setY: (update) => setPosition(prev => ({ ...prev, y: update(prev.y) }))
	}));

	/* ------------------------- animate position change ------------------------ */
	useFrame((state, delta) => {
		if (meshRef && meshRef.current && (meshRef.current.position.x != position.x || meshRef.current.position.y != position.y)) {
			const newMesh = meshRef.current.clone();
			newMesh.position.copy(
				meshRef.current.position.clone().lerp(new THREE.Vector3(position.x, position.y, 0), movementSpeed * delta)
			);
			if (newMesh.position.distanceTo(new THREE.Vector3(position.x, position.y, 0)) < 0.1) {
				meshRef.current.position.copy(new THREE.Vector3(position.x, position.y, 0));
			} else if (meshRef.current.position.distanceTo(newMesh.position) > 0.1) {
				meshRef.current.position.copy(newMesh.position);
			}

			const paddleBox = new THREE.Box3().setFromObject(meshRef.current);
			const paddleCenter = new THREE.Vector3();
			paddleBox.getCenter(paddleCenter); // Get center of the paddleBox
			state.scene.children.forEach((child) => {
				if (child.type === 'Mesh' && child !== meshRef.current) {
					const box = new THREE.Box3().setFromObject(child);
					const childCenter = new THREE.Vector3();
					box.getCenter(childCenter); // Get center of the child box
			
					if (paddleBox.intersectsBox(box)) {
						const overlapX = Math.min(paddleBox.max.x - box.min.x, box.max.x - paddleBox.min.x);
						const overlapY = Math.min(paddleBox.max.y - box.min.y, box.max.y - paddleBox.min.y);
			
						// Determine which side is overlapping
						const isLeft = paddleCenter.x > childCenter.x;
						const isAbove = paddleCenter.y < childCenter.y;
			
						let newPosition = new THREE.Vector3();
			
						if (rotated) {
							newPosition.x = isLeft ? overlapX : -overlapX;
							newPosition.y = isAbove ? -overlapY : overlapY;
						} else {
							// If not rotated, we might only care about Y axis for example
							newPosition.x = 0; // Keep X position unchanged
							newPosition.y = isAbove ? -overlapY : overlapY;
						}
			
						setPosition(prev => ({ x: prev.x + newPosition.x, y: prev.y + newPosition.y }));
					}
				}
			});
		}
	});

	return (
		<mesh ref={meshRef}>
			<boxGeometry args={rotated ? [30, 4, 4] : [4, 30, 4]} />
			<meshBasicMaterial color={color} />
		</mesh>
	)
});
Paddle.displayName = 'Paddle';

export { Paddle };
