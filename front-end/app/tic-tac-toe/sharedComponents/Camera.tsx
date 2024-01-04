import { PerspectiveCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Camera = (props) => {
	const ref = useRef();
	const keyMap = props.keyMap;

	useFrame(() => {
		if (keyMap['Digit1']) {
			ref.current.position.set(...[33, 25, 39]);
			ref.current.lookAt(...props.target);
		}
	});

	return (
		<PerspectiveCamera
			makeDefault
			ref={ref}
			fov={60}
			aspect={props.dimensions.innerWidth / props.dimensions.innerHeight}
			near={0.1}
			far={1000}
			position={[33, 25, 39]}
		/>
	);
}

export default Camera;