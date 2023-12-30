
const Torus = (props) => {
	const [x, y, z] = props.position;
	
	return (
		<mesh {...props} position={[x, y - 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
			<torusGeometry args={[2, 0.4, 8, 24]} />
			<meshBasicMaterial color={0x1aabff} transparent={props.transparent} blending={props.blending}/>
		</mesh>
	);
}

export default Torus;