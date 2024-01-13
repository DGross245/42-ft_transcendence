import { PerspectiveCamera } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { MutableRefObject, forwardRef, useEffect, useRef } from "react";
import { Mesh } from 'three'

interface CameraProps {
	target: [number, number, number],
	keyMap: { [key: string]: boolean },
	reset: boolean,
}

// TODO: change Camera position so that there is more room on top
// TODO: Move ref into parent component

/**
 * Ceates a perspective camera for a 3D scene and updates its position and orientation based on a key map.
 * @param props -
 * @returns The PerspectiveCamera component from the Three.js library.
 */

const Camera = forwardRef<Mesh, CameraProps>((props, ref) => {

//const Camera : React.FC<CameraProps>= (props) => {
	//const ref = useRef<THREE.PerspectiveCamera>(null);
	const meshRef = ref as MutableRefObject<Mesh | null>;
	const keyMap = props.keyMap;

	// On reset changes back the original position.
	useEffect(() => {
		if (meshRef && meshRef.current) {
			if (props.reset) {
				meshRef.current.position.set(...[44, 35, 47]);
				meshRef.current.lookAt(...props.target);
			}
		}
	}, [props.reset]);

	// Pressing on the Digit1 key, resets the camera back to its original spot.
	useFrame(() => {
		if (meshRef && meshRef.current) {
			if (keyMap['Digit1']) {
				meshRef.current.position.set(...[44, 35, 47]);
				meshRef.current.lookAt(...props.target);
			}
		}
	});

	return (
		<mesh ref={meshRef} >
			<PerspectiveCamera
				makeDefault
				fov={60}
				aspect={window.innerWidth / window.innerHeight}
				near={0.1}
				far={1000}
				position={[44, 35, 47]}
			/>
		</mesh>
	);
})

export default Camera;