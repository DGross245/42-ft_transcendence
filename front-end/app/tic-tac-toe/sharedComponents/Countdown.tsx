import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/fonts/Silkscreen_Regular.json';
import { extend, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useSound } from '@/components/Sound';

extend({ TextGeometry })

interface CountdownProps {
	setCountdownVisible: React.Dispatch<React.SetStateAction<boolean>>,
	countdownVisible: boolean,
}

/**
 * The Countdown component is a timer that counts down from 4 to 0 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param props -
 * @returns A mesh element that displays the current count value.
 * The visibility of the mesh is determined by the props.scoreVisible value. If props.scoreVisible is
 * false, the mesh will be visible, otherwise it will be hidden.
 */
const Countdown : React.FC<CountdownProps> = ({ countdownVisible, setCountdownVisible }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);
	const [count, setCount] = useState(3);
	const soundEngine = useSound();
	const { camera } = useThree();
	const ref = useRef<THREE.Mesh | null>(null);

	useEffect(() => {
		const meshRef = ref.current;
		if (meshRef)
			camera.add(meshRef);
		setCount(3);
	
		if (countdownVisible) {
			soundEngine?.playSound("countSound");
			const countdownInterval = setInterval(() => {
	
				setCount((prevCount) => {
					if (prevCount > 1) {
						soundEngine?.playSound("countSound");
						return (prevCount - 1);
					} else {
						clearInterval(countdownInterval);
						setCountdownVisible(false);
						soundEngine?.playSound("end");
						return (0);
					}
				});
			}, 1000);
	
			return () => {
				if (meshRef)
					camera.remove(meshRef);
				clearInterval(countdownInterval);
			};
		}
	}, [countdownVisible, soundEngine]);
	
	return (
		<mesh ref={ref} visible={countdownVisible} position={[-5, -4, -30]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;