import { PerspectiveCamera } from "@react-three/drei"

const Camera = (props) => {
	return (
		<PerspectiveCamera
			makeDefault
			fov={60}
			aspect={props.dimensions.innerWidth / props.dimensions.innerHeight}
			near={0.1}
			far={1000}
			position={[33, 25, 39]}
		/>
	);
}

export default Camera