import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Shape } from 'three';
import { Extrude } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

/**
 * The TurnDisplay component renders a 3D display of the current turn in a game, with different shapes
 * and colors representing different players.
 * @param turn - `turn`: The current turn in the game, represented as a string ('X', 'O', or '⬜️'). This
 * determines the appearance of the turn display.
 * @returns The `TurnDisplay` component is returning a group of mesh objects representing the current
 * turn in a game. The returned JSX structure includes multiple mesh objects, each representing a
 * different shape (X, O, or a square) and positioned accordingly. The position, scale, and material
 * properties of each mesh object are determined based on the `turn` prop passed to the component.
 */
const TurnDisplay = ({ turn } : { turn: string }) => {
	const ref = useRef<THREE.Group | null>(null);
	const { camera } = useThree();
	
	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};
	
	const boxShape = useMemo(() => {
		const boxShape = new Shape();

		boxShape.moveTo(-2.3, -2.3);
		boxShape.lineTo(-2.3, 2.3);
		boxShape.lineTo(2.3, 2.3);
		boxShape.lineTo(2.3, -2.3);

		const holeShape = new Shape();
		holeShape.moveTo(-1.5, -1.5);
		holeShape.lineTo(-1.5, 1.5);
		holeShape.lineTo(1.5, 1.5);
		holeShape.lineTo(1.5, -1.5);

		boxShape.holes.push(holeShape);
		return boxShape;
	}, []);

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
		<group ref={ref} scale={[0.4, 0.4, 0.4]}>
			<mesh 
				position={turn === 'X' ? [-5.5, 15.5, -30] : [-5.5, 15, -30]}
				scale={turn === 'X' ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
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

			<mesh position={[-3, 14, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh position={[-3, 13, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>

			<mesh
				position={turn === 'O' ? [-0.5, 13.6, -30] : [-0.5, 13.6, -30]}
				scale={turn === 'O' ? [0.65, 0.65, 0.65] : [0.6, 0.6, 0.6]}>
				<torusGeometry args={[2, 0.4, 8, 24]} />
				<meshBasicMaterial
					color={0x1aabff}
					transparent={true}
					opacity={turn === 'O' ? 1 : 0.4}
				/>
			</mesh>

			<mesh position={[2, 14, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh position={[2, 13, -30]} scale={[0.1, 0.1, 0.1]}>
				<boxGeometry args={[4, 4, 4]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>

			<mesh
				position={[4.5, 13.5, -30]}
				scale={turn === '⬜️' ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
			>
				<Extrude args={[boxShape, extrudeSettings]}>
					<meshBasicMaterial
						color={0x008800}
						transparent={true}
						side={DoubleSide}
						opacity={turn === '⬜️' ? 1 : 0.4}
					/>
				</Extrude>
			</mesh>
		</group>
	);
}

export default TurnDisplay