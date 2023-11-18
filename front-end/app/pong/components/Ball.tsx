import { useRef } from "react";
import { Mesh } from 'three'
import * as THREE from 'three'

const Ball = () => {
	const ref = useRef<Mesh>(null);
	return (
		<mesh ref={ref}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial
				color={ 0xffffff }
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	)
}

export default Ball