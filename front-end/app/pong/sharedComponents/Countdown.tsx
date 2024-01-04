
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/fonts/Silkscreen_Regular.json';
import { extend } from '@react-three/fiber';
import { useEffect, useState } from 'react';

extend({ TextGeometry })

const Countdown = (props) => {
	const font = new FontLoader().parse(Silkscreen_Regular);
	const [count, setCount] = useState(4);
	const [visible, setVisibility] = useState(true);

	useEffect(() => {
		const countdownInterval = setInterval(() => {

			setCount((prevCount) => {
				if (prevCount > 0)
					return (prevCount - 1);
				else {
					clearInterval(countdownInterval);
					props.setScoreVisible(true);
					setVisibility(false);
					return (0);
				}
			});
		}, 1000);

		return () => {
			clearInterval(countdownInterval);
		};
	}, [props.setScoreVisible]);

	return (
		<mesh visible={visible} position={[-35, 0, 50]} rotation={props.rotation}>
			<textGeometry args={[String(count), {font, size: 70, height: 6}]} />
			<meshBasicMaterial color={ 0xffffff } />
		</mesh>
	);
}

export default Countdown;