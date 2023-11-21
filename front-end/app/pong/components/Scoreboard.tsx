
import * as THREE from 'three'

const Scoreboard = ({ score }) => {
	console.log(score);
	return (
		<mesh position={[ 0 , 0, 30]}>
			<boxGeometry args={[9 , 9 , 9]} />
			<meshBasicMaterial
				color={ 0xffffff }
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
				/>
		</mesh>
	)
}

export default Scoreboard;