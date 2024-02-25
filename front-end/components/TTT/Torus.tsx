import { DoubleSide} from 'three';

interface TorusProps {
	position: [number, number, number],
	transparent: boolean;
	blending?: THREE.Blending,
	color: number | undefined,
}

/**
 * Create a torusGeometry with specific position and rotation.
 * @param props - The `props` parameter is an object that contains the properties passed to the `Torus`
 * component. These properties can be accessed using dot notation, for example `props.position`, `props.transparent`,
 * `props.blending` and `props.color`.
 * @returns The Torus component is returning a mesh element with a torusGeometry and
 * meshBasicMaterial.
 */
const Torus : React.FC<TorusProps> = (props) => {
	const [x, y, z] = props.position;

	return (
		<mesh {...props} position={[x, y + 0.3, z]} rotation={[Math.PI / 2, 0, 0]}>
			<torusGeometry args={[2, 0.4, 8, 24]} />
			<meshStandardMaterial color={props.color} transparent={props.transparent} side={DoubleSide} opacity={0.8}/>
		</mesh>
	);
}

export default Torus;