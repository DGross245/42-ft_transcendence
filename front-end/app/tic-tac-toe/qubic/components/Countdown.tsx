
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../../public/fonts/Silkscreen_Regular.json';
import { extend, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
extend({ TextGeometry })

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
					return (0);
				}
			});
		}, 1000);

		return () => {
			clearInterval(countdownInterval);
		};
	}, []);
	
	return (
		<mesh visible={countdownVisible} position={[10, 10, 20]} rotation={[0, Math.PI / 4, 0]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;