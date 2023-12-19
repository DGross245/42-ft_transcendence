import { PerspectiveCamera } from "@react-three/drei"

const Camera = (props) => {

	//const keyMap = props.keyMap;

	return (
		<PerspectiveCamera
			makeDefault
			fov={60}
			aspect={window.innerWidth / window.innerHeight}
			near={0.1}
			far={1000}
			position={[0, -350, 100]}
		/>
	);
}

export default Camera