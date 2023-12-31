import * as THREE from 'three';

const Floor = (props) => {
	return (
		<mesh position={props.position} rotation={[0, 0, Math.PI / 2]}>
			<boxGeometry args={props.args} />
			<meshStandardMaterial
				color={0x111111}
				transparent={true}
				metalness={0.8}
				side={THREE.BackSide}
				opacity={0.5}
				roughness={0.9}
			/>
		</mesh>
	);
}

export default Floor;