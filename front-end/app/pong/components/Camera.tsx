import { PerspectiveCamera } from "@react-three/drei"

const Camera = () => {
	return (
		<PerspectiveCamera
			makeDefault
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[0, -260, 260]}
		/>
	);
}

export default Camera