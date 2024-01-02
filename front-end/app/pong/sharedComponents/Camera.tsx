import { PerspectiveCamera } from "@react-three/drei"

const Camera = (props) => {
	return (
		<PerspectiveCamera
			makeDefault
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={props.position}
		/>
	);
}

export default Camera