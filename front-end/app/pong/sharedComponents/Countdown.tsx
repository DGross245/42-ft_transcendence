
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Orbitron_Regular from '../../../public/fonts/Orbitron_Regular.json';
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';

extend({ TextGeometry })

/**
 * The Countdown component is a timer that counts down from 4 to 0 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param props -
 * @returns A mesh element that displays the current count value.
 * The visibility of the mesh is determined by the props.scoreVisible value. If props.scoreVisible is
 * false, the mesh will be visible, otherwise it will be hidden.
 */
const Countdown = (props) => {
	const font = new FontLoader().parse(Orbitron_Regular);
	const [count, setCount] = useState(4);

	useEffect(() => {
		const countdownInterval = setInterval(() => {

			setCount((prevCount) => {
				if (prevCount > 0)
					return (prevCount - 1);
				else {
					clearInterval(countdownInterval);
					props.setScoreVisible(true);
					setCount(1);
					return (0);
				}
			});
		}, 1000);

		return () => {
			clearInterval(countdownInterval);
		};
	}, [props.scoreVisible]);

	return (
		<mesh visible={!props.scoreVisible} position={ count === 1 ? [-23, 0, 50] : [-35, 0, 50]} rotation={props.rotation}>
			<textGeometry args={[String(count), {font, size: 60, height: 6}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}

export default Countdown;