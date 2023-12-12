
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../public/Silkscreen_Regular.json';
import { extend } from '@react-three/fiber';

extend({ TextGeometry })

const Scoreboard = ({ player1, player2 }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);

	return (
		<>
			<mesh position={[-64.5,40,-6]}>
				<textGeometry args={[String(player1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh position={[30,40,-6]}>
				<textGeometry args={[String(player2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
		</>
	)
}

export default Scoreboard;