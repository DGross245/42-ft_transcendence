import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/fonts/Silkscreen_Regular.json';
import { extend, useThree } from '@react-three/fiber';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSound } from '@/components/Sound';
import { TTTContext } from '../TTTProvider';

extend({ TextGeometry })

interface CountdownProps {
	setCountdownVisible: React.Dispatch<React.SetStateAction<boolean>>,
	countdownVisible: boolean,
}

/**
 * The Countdown component is a timer that counts down from 3 to 1 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param  - - `countdownVisible`: a boolean value indicating whether the countdown should be visible
 *				or not.
 *		   - - `setCountdownVisible`: a state setter for setting the countdown state.
 * @returns The Countdown component is returning a mesh that contains a textGeometry and a
 * meshBasicMaterial. The textGeometry displays the value of the count variable, which is initially set
 * to 3 and decrements by 1 every second until it reaches 1. The meshBasicMaterial sets the color of
 * the text to white. The mesh is only visible when the countdownVisible prop is true.
 */
const Countdown : React.FC<CountdownProps> = ({ countdownVisible, setCountdownVisible }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);
	const [count, setCount] = useState(3);
	const soundEngine = useSound();
	const { camera } = useThree();
	const ref = useRef<THREE.Mesh | null>(null);
	const { gameState } = useContext(TTTContext);

	useEffect(() => {
		const meshRef = ref.current;
		if (meshRef)
			camera.add(meshRef);
		setCount(3);
	
		if (gameState.pause)
			return ;
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
						return (1);
					}
				});
			}, 1000);
	
			return () => {
				if (meshRef)
					camera.remove(meshRef);
				clearInterval(countdownInterval);
			};
		}
	}, [countdownVisible, soundEngine, gameState.pause]);
	
	return (
		<mesh ref={ref} visible={countdownVisible} position={[-5, -4, -30]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;