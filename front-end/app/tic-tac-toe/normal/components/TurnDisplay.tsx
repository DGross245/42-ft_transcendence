import { MutableRefObject, forwardRef, useMemo, useRef } from "react";
import { DoubleSide, Shape, Mesh } from 'three';
import { Extrude } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { user } from "@nextui-org/theme";

const TurnDisplay = forwardRef<THREE.Mesh>((ref) => {
	const meshRef = useRef<THREE.Mesh | null>(null);

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

	return (
		<mesh position={[0,30,0]} ref={meshRef}>
			<Extrude args={[xShape, extrudeSettings]}>
				<meshBasicMaterial 
					color={0xff0000}
					side={DoubleSide}
					opacity={0.8}
				/>
			</Extrude>
		</mesh>
	);
})

export default TurnDisplay