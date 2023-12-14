import * as THREE from "three"

const Border = ({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
	const [x, y, z] = position;

	return (
		<group >
			<mesh position={position}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[x - 21, y + 21, z]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[46, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
		</group>
	);
}

export default Border