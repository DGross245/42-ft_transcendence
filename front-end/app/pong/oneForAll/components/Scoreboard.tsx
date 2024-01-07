import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Orbitron_Regular from '../../../../public/fonts/Orbitron_Regular.json';
import { Vector3, extend } from '@react-three/fiber';

extend({ TextGeometry })

type ScoreType = {
	[key: number]: { position: Vector3 };
}

/**
 * The Scoreboard component displays the scores of four players on a 3D scoreboard.
 * @param player1 - The score of player 1.
 * @param player2 - The score of player 2.
 * @param player3 - The score of player 3.
 * @param player4 - The score of player 4.
 * @param scoreVisible - A state that determines if the scores should be visible.
 * @returns A JSX fragment containing two mesh elements. Each
 * mesh element represents a player's score.
 */
const Scoreboard = ({ player1, player2, player3, player4, scoreVisible }) => {
	const font = new FontLoader().parse(Orbitron_Regular);

	const position1 : Vector3 = player1 === 1 || player1 === 7 ? [-170, -13, 50] : [-170, -21, 50];
	const position2 : Vector3 = player2 === 1 || player2 === 7 ? [170, 13, 50] : [170, 21, 50];
	const position3 : Vector3 = player3 === 1 || player3 === 7 ? [-13, 170, 50] : [-21, 170, 50];
	const position4 : Vector3 = player4 === 1 || player4 === 7 ? [-13,-210, -5] : [-21,-210, -5];

	return (
		<>
			<mesh visible={scoreVisible} position={position1} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
				<textGeometry args={[String(player1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={position2} rotation={[Math.PI / 2, -Math.PI / 2, 0]}>
				<textGeometry args={[String(player2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={position3} rotation={[Math.PI / 2, 0, 0]}>
				<textGeometry args={[String(player3), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={position4}>
				<textGeometry args={[String(player4), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
		</>
	)
}

export default Scoreboard;