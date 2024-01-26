import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Orbitron_Regular from '../../../../public/fonts/Orbitron_Regular.json';
import { Vector3, extend } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';

extend({ TextGeometry })

interface ScoreboardProps {
	player1: number,
	player2: number,
	player3: number,
	player4: number,
	rightPaddleRef: MutableRefObject<Mesh>,
	leftPaddleRef: MutableRefObject<Mesh>,
	bottomPaddleRef: MutableRefObject<Mesh>,
	topPaddleRef: MutableRefObject<Mesh>,
	scoreVisible: boolean,
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
const Scoreboard : React.FC<ScoreboardProps> = ({ 
	player1, player2, player3, player4, 
	rightPaddleRef, leftPaddleRef, bottomPaddleRef, topPaddleRef,
	scoreVisible }) => {
	const font = new FontLoader().parse(Orbitron_Regular);

	//// Player 1
	const position1 : Vector3 = player1 === 1 || player1 === 7 ? [ -13, -5, 210] : [ -21, -5, 210];
	const position2 : Vector3 = player2 === 1 || player2 === 7 ? [-170, 50,  13] : [-170, 50,  21];
	const position3 : Vector3 = player3 === 1 || player3 === 7 ? [ -13, 50,-170] : [ -21, 50,-170];
	const position4 : Vector3 = player4 === 1 || player4 === 7 ? [ 170, 50, -13] : [ 170, 50, -21];
	////rotation={[ -Math.PI / 2, 0, 0]}
	////rotation={[0, Math.PI / 2, 0]}
	////rotation={[0, 0, 0]}
	////rotation={[0, -Math.PI / 2, 0]}

	//// Player 2
	//const position1 : Vector3 = player1 === 1 || player1 === 7 ? [  13, 50, 170] : [  21, 50, 170];
	//const position2 : Vector3 = player2 === 1 || player2 === 7 ? [-170, -5, -13] : [-210, -5, -21];
	//const position3 : Vector3 = player3 === 1 || player3 === 7 ? [ -13, 50,-170] : [ -21, 50,-170];
	//const position4 : Vector3 = player4 === 1 || player4 === 7 ? [ 170, 50, -13] : [ 170, 50, -21];
	////rotation={[ 0, -Math.PI, 0]}
	////rotation={[ Math.PI / 2, -Math.PI, Math.PI / 2]}
	////rotation={[0, 0, 0]}
	////rotation={[0, -Math.PI / 2, 0]}

	//// Player 3
	//const position1 : Vector3 = player1 === 1 || player1 === 7 ? [  13, 50, 170] : [  21, 50, 170];
	//const position2 : Vector3 = player2 === 1 || player2 === 7 ? [-170, 50,  13] : [-170, 50,  21];
	//const position3 : Vector3 = player3 === 1 || player3 === 7 ? [  13, -5,-210] : [  21, -5,-210];
	//const position4 : Vector3 = player4 === 1 || player4 === 7 ? [ 170, 50, -13] : [ 170, 50, -21];
	////rotation={[ 0, -Math.PI, 0]}
	////rotation={[0, Math.PI / 2, 0]}
	////rotation={[-Math.PI / 2, 0, -Math.PI]}
	////rotation={[0, -Math.PI / 2, 0]}

	//// Player 4
	//const position1 : Vector3 = player1 === 1 || player1 === 7 ? [  13, 50, 170] : [  21, 50, 170];
	//const position2 : Vector3 = player2 === 1 || player2 === 7 ? [-170, 50,  13] : [-170, 50,  21];
	//const position3 : Vector3 = player3 === 1 || player3 === 7 ? [ -13, 50,-170] : [ -21, 50,-170];
	//const position4 : Vector3 = player4 === 1 || player4 === 7 ? [ 210, -5, 13] : [ 210, -5, 21];
	////rotation={[ 0, -Math.PI, 0]}
	////rotation={[0, Math.PI / 2, 0]}
	////rotation={[0, 0, 0]}
	////rotation={[-Math.PI / 2, 0, Math.PI / 2]}

	const getColor = ( ref:  MutableRefObject<Mesh>) => {
		if (ref && ref.current) {
			const material = ref.current.material as MeshBasicMaterial;
			const currentColor = material.color.getHex();
			return (currentColor);
		}
		else
			return ( 0xffffff );
	}

	return (
		<>
			<mesh visible={scoreVisible} position={position1} rotation={[ -Math.PI / 2, 0, 0]} >
				<textGeometry args={[String(1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(bottomPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={position2} rotation={[0, Math.PI / 2, 0]} >
				<textGeometry args={[String(2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(leftPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={position3} rotation={[0, 0, 0]} >
				<textGeometry args={[String(3), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(topPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={position4} rotation={[0, -Math.PI / 2, 0]}>
				<textGeometry args={[String(4), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(rightPaddleRef) } />
			</mesh>
		</>
	)
}

export default Scoreboard;