import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

const Floor = (props) => {

	return (
		<mesh {...props } rotation={[0, 0, Math.PI / 2]}>
			<boxGeometry args={[0.25, 19, 19]} />
			<meshBasicMaterial
					color={ 0x333333 }
					transparent={true}
					blending={THREE.AdditiveBlending}
					side={THREE.BackSide}
				/>
		</mesh>
	)
}

export default Floor