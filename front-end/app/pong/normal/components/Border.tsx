import * as THREE from "three"

const Border = ({ position }: { position: [number, number, number] }) => {
	return (
		<mesh position={position}>
			<boxGeometry args={[306, 4, 4]}/>
			<meshBasicMaterial
				color={ new THREE.Color(16, 16, 16) }
				toneMapped={false}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
}

export default Border