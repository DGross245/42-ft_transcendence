import { Extrude } from '@react-three/drei';
import { useMemo } from 'react';
import { DoubleSide} from 'three';
import * as THREE from 'three'

interface SquareProps {
	position: [number, number, number],
	transparent: boolean;
	color: number | undefined,
}

/**
 * Creates a 3D geometry similar to an 3D square frame using the Extrude component.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `position`, `transparent` and `color`.
 * @returns A mesh with this new block component.
 */
const Square : React.FC<SquareProps> = (props) => {
	const [x, y, z] = props.position;

	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};

	const shape = useMemo(() => {
		const boxShape = new THREE.Shape();

		boxShape.moveTo(-2.3, -2.3);
		boxShape.lineTo(-2.3, 2.3);
		boxShape.lineTo(2.3, 2.3);
		boxShape.lineTo(2.3, -2.3);

		const holeShape = new THREE.Shape();
		holeShape.moveTo(-1.5, -1.5);
		holeShape.lineTo(-1.5, 1.5);
		holeShape.lineTo(1.5, 1.5);
		holeShape.lineTo(1.5, -1.5);

		boxShape.holes.push(holeShape);
		return boxShape;
	}, []);

	return (
		<mesh position={[x, y + 0.7, z]} rotation={[Math.PI / 2, 0, 0]}>
			<Extrude args={[shape, extrudeSettings]}>
				<meshStandardMaterial
					color={props.color}
					transparent={props.transparent}
					side={DoubleSide}
					opacity={0.4}
				/>
			</Extrude>
		</mesh>
	);
}

export default Square;