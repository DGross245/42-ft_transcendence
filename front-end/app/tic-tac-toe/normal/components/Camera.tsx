import { PerspectiveCamera } from "@react-three/drei"
import { useEffect, useRef } from "react";

const Camera = (props) => {
	const ref = useRef();

	useEffect(() => {
	  if (ref.current) {
		const position = ref.current.position;
		props.setCameraPosition({ x: position.x, y: position.y, z: position.z });
	  }
	}, [props.dimensions, props.setCameraPosition]);

	return (
		<PerspectiveCamera
			ref={ref}
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