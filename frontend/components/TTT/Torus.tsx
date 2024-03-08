import { DoubleSide} from 'three';

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */

interface TorusProps {
	position: [number, number, number],
	transparent: boolean;
	blending?: THREE.Blending,
	color: number | undefined,
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

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
		<mesh position={[x, y + 0.36, z]} rotation={[Math.PI / 2, 0, 0]}>
			<torusGeometry args={[2, 0.44, 8, 30]} />
			<meshStandardMaterial
				color={props.color}
				transparent={props.transparent}
				side={DoubleSide}
				opacity={0.4}
			/>
		</mesh>
	);
}

export default Torus;