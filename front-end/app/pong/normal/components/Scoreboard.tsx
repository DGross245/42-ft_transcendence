import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Orbitron_Regular from '../../../../public/fonts/Orbitron_Regular.json';
import { Vector3, extend } from '@react-three/fiber';

extend({ TextGeometry })

type ScoreType = {
	[key: number]: { position: Vector3 };
}

/**
 * The Scoreboard component displays the scores of two players on a 3D scoreboard.
 * @param player1 - The score of player 1.
 * @param player2 - The score of player 2.
 * @param scoreVisible - A state that determines if the scores should be visible.
 * @returns A JSX fragment containing two mesh elements. Each
 * mesh element represents a player's score.
 */
const Scoreboard = ({ player1, player2, scoreVisible }) => {
	const font = new FontLoader().parse(Orbitron_Regular);

	// Reposition textGeometry based on score.
	const Score1 : ScoreType = {
		0:	{ position: [-70.8, 40, -6] },
		1:	{ position: [-62.8, 40, -6] },
		2:	{ position: [  -71, 40, -6] },
		3:	{ position: [  -71, 40, -6] },
		4:	{ position: [  -70, 40, -6] },
		5:	{ position: [  -70, 40, -6] },
		6:	{ position: [  -70, 40, -6] },
		7:	{ position: [  -63, 40, -6] },
	}

	const Score2 : ScoreType = {
		0:	{ position: [ 30, 40, -6] },
		1:	{ position: [ 38, 40, -6] },
		2:	{ position: [ 30, 40, -6] },
		3:	{ position: [ 30, 40, -6] },
		4:	{ position: [ 33, 40, -6] },
		5:	{ position: [ 33, 40, -6] },
		6:	{ position: [ 33, 40, -6] },
		7:	{ position: [ 38, 40, -6] },
	}

	const position1 : Vector3 = Score1[player1]?.position;
	const position2 : Vector3 = Score2[player2]?.position;

	return (
		<>
			<mesh visible={scoreVisible} position={position1} rotation={[0, 0, 0]}>
				<textGeometry args={[String(player1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
			<mesh visible={scoreVisible} position={position2}>
				<textGeometry args={[String(player2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ 0xffffff } />
			</mesh>
		</>
	);
}

export default Scoreboard