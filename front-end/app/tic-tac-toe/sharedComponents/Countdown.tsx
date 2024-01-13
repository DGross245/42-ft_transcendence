import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/fonts/Silkscreen_Regular.json';
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';
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

	useEffect(() => {
		if (countdownVisible) {
			soundEngine?.playSound("countSound");
			const countdownInterval = setInterval(() => {
	
				setCount((prevCount) => {
					if (prevCount > 0) {
						soundEngine?.playSound("countSound");
						return (prevCount - 1);
					} else {
						clearInterval(countdownInterval);
						setCountdownVisible(false);
						soundEngine?.playSound("end");
						setCount(3);
						return (0);
					}
				});
			}, 1000);
	
			return () => {
				clearInterval(countdownInterval);
			};
		}
	}, [countdownVisible, soundEngine]);
	
	return (
		<mesh visible={countdownVisible} position={[11, 13, 20]} rotation={[0, Math.PI / 4, 0]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;