import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Object3DNode, Vector3, extend } from '@react-three/fiber';
import { MutableRefObject } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';

import Orbitron_Regular from '../../public/fonts/Orbitron_Regular.json';
import { usePongGameState } from './hooks/usePongGameState';

extend({ TextGeometry })

type ScoreType = {
	[key: number]: { position: Vector3 };
}

/* The `declare module` statement is used to extend the existing module declaration in TypeScript.
Used for extending the `@react-three/fiber` module and adding to the ThreeElements interface the definition
for textGeometry, because the property 'textGeometry' does not exist on type 'JSX.IntrinsicElements'*/
declare module "@react-three/fiber" {
	interface ThreeElements {
	  textGeometry: Object3DNode<TextGeometry, typeof TextGeometry>;
	}
}

/**
 * The Scoreboard component displays the scores of two players on a 3D scoreboard.
 * @param player1 - The score of player 1.
 * @param player2 - The score of player 2.
 * @param scoreVisible - A state that determines if the scores should be visible.
 * @returns A JSX fragment containing two mesh elements. Each
 * mesh element represents a player's score.
 */
export const Scoreboard = () => {
	const font = new FontLoader().parse(Orbitron_Regular);
	const { scores, isScoreVisible, rightPaddleRef, leftPaddleRef } = usePongGameState();

	// Reposition textGeometry based on score.
	const Score1 : ScoreType = {
		0:	{ position: [-70.8, 6, -40] },
		1:	{ position: [-62.8, 6, -40] },
		2:	{ position: [  -71, 6, -40] },
		3:	{ position: [  -71, 6, -40] },
		4:	{ position: [  -70, 6, -40] },
		5:	{ position: [  -70, 6, -40] },
		6:	{ position: [  -70, 6, -40] },
		7:	{ position: [  -63, 6, -40] },
	}

	const Score2 : ScoreType = {
		0:	{ position: [ 30, 6, -40] },
		1:	{ position: [ 38, 6, -40] },
		2:	{ position: [ 30, 6, -40] },
		3:	{ position: [ 30, 6, -40] },
		4:	{ position: [ 33, 6, -40] },
		5:	{ position: [ 33, 6, -40] },
		6:	{ position: [ 33, 6, -40] },
		7:	{ position: [ 38, 6, -40] },
	}

	const position1 : Vector3 = Score1[scores.p1Score]?.position;
	const position2 : Vector3 = Score2[scores.p2Score]?.position;

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
			<mesh visible={isScoreVisible} position={position1} rotation={[-Math.PI / 2, 0, 0]} >
				<textGeometry args={[String(scores.p1Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(leftPaddleRef) } />
			</mesh>
			<mesh visible={isScoreVisible} position={position2} rotation={[-Math.PI / 2, 0, 0]}>
				<textGeometry args={[String(scores.p2Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(rightPaddleRef) } />
			</mesh>
		</>
	);
}