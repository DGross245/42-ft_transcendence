import { useMemo } from 'react';
import { DoubleSide} from 'three';
import { Extrude } from '@react-three/drei';
import * as THREE from 'three'

const X = (props) => {
	const [x, y, z] = props.position;

	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};

	const shape = useMemo(() => {
		const xShape = new THREE.Shape();

		xShape.moveTo(-2.3, -1.7);
		xShape.lineTo(-1.3, -0.7);
		xShape.lineTo(0, -2);
		xShape.lineTo(1.3, -0.7);
		xShape.lineTo(2.3, -1.7);
		xShape.lineTo(1, -3);
		xShape.lineTo(2.3, -4.3);
		xShape.lineTo(1.3, -5.3);
		xShape.lineTo(0, -4);
		xShape.lineTo(-1.3, -5.3);
		xShape.lineTo(-2.3, -4.3);
		xShape.lineTo(-1, -3);
		xShape.lineTo(-2.3, -1.7);

		return xShape;
	}, []);

	return (
		<mesh {...props} position={[x, y + 0.3, z + 3]} rotation={[Math.PI / 2, 0, 0]}>
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
};

export default X;
