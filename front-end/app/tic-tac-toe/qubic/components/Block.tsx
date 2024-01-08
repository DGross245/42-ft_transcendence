import { Extrude } from '@react-three/drei';
import { DoubleSide} from 'three';
import * as THREE from 'three'

// TODO: Maybe switch back to useMemo
/**
 * Creates a 3D geometry similar to an 3D square frame using the Extrude component.
 * @param
 * @returns A mesh with this new block component.
 */
const Block = (props) => {
	const [x, y, z] = props.position;

	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};

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

	return (
		<mesh {...props} position={[x, y + 0.3, z]} rotation={[Math.PI / 2, 0, 0]}>
			<Extrude args={[boxShape, extrudeSettings]}>
				<meshBasicMaterial
					color={props.color}
					transparent={props.transparent}
					side={DoubleSide}
					opacity={0.8}
				/>
			</Extrude>
		</mesh>
	);
}

export default Block;