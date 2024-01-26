import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Orbitron_Regular from '../../../../public/fonts/Orbitron_Regular.json';
import { Vector3, extend } from '@react-three/fiber';
import { MutableRefObject, useContext, useEffect } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';
import { PongContext } from '../../PongProvider';

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

interface PosInfo {
	position: [number, number, number],
	rotation: [number, number, number],
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
	const { playerState } = useContext(PongContext);
	const font = new FontLoader().parse(Orbitron_Regular);

	var InitialPos: PosInfo[] = [
		{
			position: player1 === 1 || player1 === 7 ? [ -13, -5, 210] : [ -21, -5, 210],
			rotation:[-Math.PI / 2, 0, 0]
		},
		{
			position: player2 === 1 || player2 === 7 ? [-170, 50,  13] : [-170, 50,  21],
			rotation: [0, Math.PI / 2, 0]
		},
		{
			position: player3 === 1 || player3 === 7 ? [ -13, 50,-170] : [ -21, 50,-170],
			rotation: [0, 0, 0]
		},
		{
			position: player4 === 1 || player4 === 7 ? [ 170, 50, -13] : [ 170, 50, -21],
			rotation: [0, -Math.PI / 2, 0]
		},

	]

	const replacePosAndRot = (player : number): PosInfo => {
		switch (player) {
			case 1:
				return {
					position: player1 === 1 || player1 === 7 ? [ -13, -5, 210] : [ -21, -5, 210],
					rotation:[-Math.PI / 2, 0, 0]
				};
			case 2:
				return {
					position: player2 === 1 || player2 === 7 ? [-210, -5, -13] : [-210, -5, -21],
					rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
				};
			case 3:
				return {
					position: player3 === 1 || player3 === 7 ? [  13, -5,-210] : [  21, -5,-210],
					rotation:[-Math.PI / 2, 0, -Math.PI]
				};
			case 4:
				return {
					position: player4 === 1 || player4 === 7 ? [ 210, -5, 13] : [ 210, -5, 21],
					rotation:[-Math.PI / 2, 0, Math.PI / 2]
				};
			default:
				return {
					position: [0, 0, 0],
					rotation: [0, 0, 0]
				};
		}
	};

	useEffect(() => {
		if (playerState.client !== -1) {
			console.log("KEK")
			const { position, rotation } = replacePosAndRot(playerState.client);
			InitialPos[playerState.client].position = position
			InitialPos[playerState.client].rotation = rotation
		}
	}, [playerState.client]);

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
			<mesh visible={scoreVisible} position={InitialPos[0].position} rotation={InitialPos[0].rotation} >
				<textGeometry args={[String(1), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(bottomPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={InitialPos[1].position} rotation={InitialPos[1].rotation} >
				<textGeometry args={[String(2), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(leftPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={InitialPos[2].position} rotation={InitialPos[2].rotation} >
				<textGeometry args={[String(3), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(topPaddleRef) } />
			</mesh>
			<mesh visible={scoreVisible} position={InitialPos[3].position} rotation={InitialPos[3].rotation}>
				<textGeometry args={[String(4), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(rightPaddleRef) } />
			</mesh>
		</>
	)
}

export default Scoreboard;