
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../../public/Silkscreen_Regular.json';
import { extend, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

extend({ TextGeometry })

const Countdown = ({ setScoreVisible }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);
	const [count, setCount] = useState(4);
	const [visible, setVisibility] = useState(true);
	const ref = useRef();

	useEffect(() => {
		const countdownInterval = setInterval(() => {

			setCount((prevCount) => {
				if (prevCount > 0) {
					return (prevCount - 1);
				} else {
					clearInterval(countdownInterval);
					setScoreVisible(true);
					setVisibility(false);
					return (0);
				}
			});
		}, 1000);

		return () => {
			clearInterval(countdownInterval);
		};
	}, [setScoreVisible]);

	return (
		<mesh ref={ref} visible={visible} position={[-35, 0, 50]}>
			<textGeometry args={[String(count), {font, size: 70, height: 6}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	)
}

export default Countdown;