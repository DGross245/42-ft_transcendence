import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/fonts/Silkscreen_Regular.json';
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';

extend({ TextGeometry })
//TODO: Fix position of textGeometry
/**
 * The Countdown component is a timer that counts down from 4 to 0 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param props -
 * @returns A mesh element that displays the current count value.
 * The visibility of the mesh is determined by the props.scoreVisible value. If props.scoreVisible is
 * false, the mesh will be visible, otherwise it will be hidden.
 */
const Countdown = ({ countdownVisible, setCountdownVisible }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);
	const [count, setCount] = useState(4);

	useEffect(() => {
		const countdownInterval = setInterval(() => {

			setCount((prevCount) => {
				if (prevCount > 0) {
					return (prevCount - 1);
				} else {
					clearInterval(countdownInterval);
					setCountdownVisible(false);
					setCount(4);
					return (0);
				}
			});
		}, 1000);

		return () => {
			clearInterval(countdownInterval);
		};
	}, [countdownVisible]);
	
	return (
		<mesh visible={countdownVisible} position={[10, 10, 20]} rotation={[0, Math.PI / 4, 0]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;