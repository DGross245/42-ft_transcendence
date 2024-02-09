import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import Orbitron_Regular from '@/public/fonts/Orbitron_Regular.json';
import { usePongGameState } from '@/app/pong/hooks/usePongGameState';
import { useSound } from '../hooks/Sound';

extend({ TextGeometry })

/**
 * The Countdown component is a timer that counts down from 4 to 0 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `setScoreVisible`, `scoreVisible` and `rotation`.
 * @returns A mesh element that displays the current count value.
 * The visibility of the mesh is determined by the props.scoreVisible value. If props.scoreVisible is
 * false, the mesh will be visible, otherwise it will be hidden.
 */
const Countdown = () => {
	const font = new FontLoader().parse(Orbitron_Regular);
	const [count, setCount] = useState(4);
	const { pongGameState, isScoreVisible, setScoreVisibility, countdownPos, countdownRot} = usePongGameState();
	const soundEngine = useSound();

	useEffect(() => {
		if (pongGameState.pause) return ;
		if (!isScoreVisible) {
			const countdownInterval = setInterval(() => {
				
				setCount((prevCount) => {
					if (prevCount > 0) {
						soundEngine?.playSound("pongCountdown");
						return (prevCount - 1);
					} else {
						clearInterval(countdownInterval);
						setScoreVisibility(true);
						setCount(4);
						return (0);
					}
				});
			}, 1000);

			return () => {
				clearInterval(countdownInterval);
			};
		}
	}, [isScoreVisible, pongGameState.pause]);

	return (
		<mesh visible={!isScoreVisible} position={ count === 1 ? countdownPos[0] : countdownPos[1]} rotation={countdownRot}>
			<textGeometry args={[String(count), {font, size: 60, height: 6}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}

export default Countdown;