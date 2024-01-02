
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Silkscreen_Regular from '../../../../public/fonts/Silkscreen_Regular.json';
import { extend } from '@react-three/fiber';

extend({ TextGeometry })

const Scoreboard = ({ player1, player2, player3, player4, scoreVisible }) => {
	const font = new FontLoader().parse(Silkscreen_Regular);

	return (
		<>
			<mesh visible={scoreVisible} position={[-170, -17, 50]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
				<textGeometry args={[String(player1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={[170, 17, 50]} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
				<textGeometry args={[String(player2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={[-17, 170, 50]} rotation={[Math.PI / 2, 0, 0]}>
				<textGeometry args={[String(player3), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={[-17,-210, -5]}>
				<textGeometry args={[String(player4), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
		</>
	)
}

export default Scoreboard;