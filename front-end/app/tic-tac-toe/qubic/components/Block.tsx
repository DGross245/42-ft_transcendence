
import { MeshBasicMaterial, Shape, ExtrudeGeometry, DoubleSide} from 'three';

const block = (props) => {
	const [x, y, z] = props.position;

	const boxShape = new Shape();
	boxShape.moveTo(-2, -2);
	boxShape.lineTo(-2, 2);
	boxShape.lineTo(2, 2);
	boxShape.lineTo(2, -2);

	const holeShape = new Shape();
	holeShape.moveTo(-1.3, -1.3);
	holeShape.lineTo(-1.3, 1.3);
	holeShape.lineTo(1.3, 1.3);
	holeShape.lineTo(1.3, -1.3);

	boxShape.holes.push(holeShape);

	const option = {
		depth: 0.75,
		bevelEnabled: false,
	};

	const geometry = new ExtrudeGeometry(boxShape, option);

	const material = new MeshBasicMaterial({
		color: props.color,
		transparent: props.transperent,
		opacity: 0.5,
		side: DoubleSide,
		blending: props.blending
	});

	return (
		<mesh {...props} position={[x, y + 0.3, z]} rotation={[Math.PI / 2, 0, 0]} geometry={geometry}>
			<primitive object={material} />
		</mesh>
	);
}

export default block;