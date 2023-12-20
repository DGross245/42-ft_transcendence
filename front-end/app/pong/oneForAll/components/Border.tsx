import * as THREE from "three"

// TODO: Clean up this mess

const Border = () => {
	const [x, y, z] = [130,151,0];
	const [x1, y1, z1] = [-130,151,0];
	const [x2, y2, z2] = [-130,-151,0];
	const [x3, y3, z3] = [130,-151,0];

	return (
		<group >
			<mesh position={[133,151,0]} >
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[x + 21, y - 18, z]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-133,151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[x1 - 21, y1 - 18, z1]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-133,-151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[x2 - 21, y2 + 18, z2]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[133,-151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ new THREE.Color(16, 16, 16) }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[x3 + 21, y3 + 18, z3]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
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