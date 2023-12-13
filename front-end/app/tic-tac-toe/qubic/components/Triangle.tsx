
import { BufferGeometry, BufferAttribute, Mesh, MeshBasicMaterial, Shape, ExtrudeGeometry} from 'three';

const Triangle = (props) => {
	const [x, y, z] = props.position;

	const triangleShape = new Shape();
	triangleShape.moveTo(0, 2);
	triangleShape.lineTo(2, 2);
	triangleShape.lineTo(0, -2.5);
	triangleShape.lineTo(-2, 2);

	const option = {
	  depth: 0.75,
	  bevelEnabled: false,
	};


	const geometry = new ExtrudeGeometry(triangleShape, option);

	return (
		<mesh {...props} position={[x, y + 0.3, z]} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
			<meshBasicMaterial color={props.color} transparent={props.transparent}  blending={props.blending} />
		</mesh>
	);
}

export default Triangle;