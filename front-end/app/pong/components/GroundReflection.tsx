import { MeshReflectorMaterial } from "@react-three/drei"
import * as THREE from 'three'

const GroundReflection = () => {
	return (
		<>
			<mesh position={[0, 0, -4]}>
				<planeGeometry args={[360, 230]}/>
					<MeshReflectorMaterial
						mirror={0.1}
						blur={[200, 100]}
						resolution={1000}
						mixBlur={1}
						mixStrength={60}
						roughness={1}
						depthScale={1.2}
						minDepthThreshold={0.6}
						maxDepthThreshold={1.4}
						color="#151515"
						metalness={0.5}
					/>
			</mesh>
			<mesh>
				<planeGeometry args={[360, 230]}/>
				<meshBasicMaterial
					color={ 0x111111 }
					transparent={true}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
			</mesh>
		</>
	);
}

export default GroundReflection