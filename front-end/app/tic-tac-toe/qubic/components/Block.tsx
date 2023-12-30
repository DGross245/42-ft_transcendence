
import { Extrude } from '@react-three/drei';
import { useMemo } from 'react';
import { MeshBasicMaterial, Shape, ExtrudeGeometry, DoubleSide} from 'three';
import * as THREE from 'three'

const Block = (props) => {
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
		<mesh {...props} position={[x, y + 0.3, z]} rotation={[Math.PI / 2, 0, 0]}>
			<Extrude args={[shape, extrudeSettings]}>
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