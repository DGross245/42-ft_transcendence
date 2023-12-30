import * as THREE from "three"

// TODO: Clean up this mess

const Border = () => {
	return (
		<group >
			<mesh position={[131,151,0]} >
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[151, 131, 0]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-131,151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-151, 131, 0]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-131,-151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[-151, -131, 0]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[131,-151,0]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
					toneMapped={false}
					transparent={false}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
			<mesh position={[151, -131, 0]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[40, 4, 4]}/>
				<meshBasicMaterial
					color={ 0xffffff }
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