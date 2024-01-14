import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Shape } from 'three';
import { Extrude } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/**
 * The TurnDisplay component renders a 3D representation of the current turn in a game, either an 'X'
 * or an 'O'.
 * @param turn - `turn`: A string representing the current turn, either 'X' or 'O'. This determines the
 * position, scale, and opacity of the shapes in the display.
 * @returns The TurnDisplay component is being returned.
 */
const TurnDisplay = ({ turn } : { turn: string }) => {
	const ref = useRef<THREE.Group | null>(null);
	const { camera } = useThree();
	
	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};
	
	const xShape = useMemo(() => {
		const shape = new Shape();
		
		shape.moveTo(-2.3, -1.7);
		shape.lineTo(-1.3, -0.7);
		shape.lineTo(0, -2);
		shape.lineTo(1.3, -0.7);
		shape.lineTo(2.3, -1.7);
		shape.lineTo(1, -3);
		shape.lineTo(2.3, -4.3);
		shape.lineTo(1.3, -5.3);
		shape.lineTo(0, -4);
		shape.lineTo(-1.3, -5.3);
		shape.lineTo(-2.3, -4.3);
		shape.lineTo(-1, -3);
		shape.lineTo(-2.3, -1.7);
		
		return shape;
	}, []);
	
	// binding display to the camera.
	useEffect(() => {
		const meshRef = ref.current;
		if (meshRef)
			camera.add(meshRef);
	
		return () => {
			if (meshRef)
				camera.remove(meshRef);
		};
	}, [camera, ref.current]);
	
	return (
		<group ref={ref}>
			<mesh 
				position={turn === 'X' ? [-3, 15.5, -30] : [-3, 15, -30]}
				scale={turn === 'X' ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5]}
			>
				<Extrude args={[xShape, extrudeSettings]}>
					<meshBasicMaterial 
						color={0xff0000}
						side={DoubleSide}
						opacity={turn === 'X' ? 0.8 : 0.4}
						transparent={true}
					/>
				</Extrude>
			</mesh>
			<mesh position={[-0.5, 14, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh position={[-0.5, 13, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh
				position={turn === 'O' ? [2.2, 13.6, -30] : [2.2, 13.6, -30]}
				scale={turn === 'O' ? [0.8, 0.8, 0.8] : [0.6, 0.6, 0.6]}>
				<torusGeometry args={[2, 0.4, 8, 24]} />
				<meshBasicMaterial
					color={0x1aabff}
					transparent={true}
					opacity={turn === 'O' ? 1 : 0.4}
				/>
			</mesh>
		</group>
	);
}

export default TurnDisplay