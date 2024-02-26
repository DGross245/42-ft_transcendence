import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { extend } from '@react-three/fiber';
import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';

import Orbitron_Regular from '../../public/fonts/Orbitron_Regular.json';
import { usePongSocket } from '@/app/pong/hooks/usePongSocket';
import { usePongGameState } from '@/app/pong/hooks/usePongGameState';

extend({ TextGeometry })

interface PosAndRotInfo {
	position: [number, number, number][],
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
const Scoreboard = () => {
	const font = new FontLoader().parse(Orbitron_Regular);
	const {
		scores,
		isScoreVisible,
		leftPaddleRef,
		rightPaddleRef,
		topPaddleRef,
		bottomPaddleRef
	} = usePongGameState();
	const { playerState } = usePongSocket();

	const [posAndRot, setPosAndRot] = useState<PosAndRotInfo[]>([
		{
			position: [[ 13, 50, 170], [ 21, 50, 170]],
			rotation:[0, -Math.PI, 0]
		},
		{
			position: [[-170, 50, 13],[-170, 50,  21]],
			rotation: [0, Math.PI / 2, 0]
		},
		{
			position: [[ -13, 50,-170],[ -21, 50,-170]],
			rotation: [0, 0, 0]
		},
		{
			position: [[ 170, 50, -13],[ 170, 50, -21]],
			rotation: [0, -Math.PI / 2, 0]
		},
	])

	const replacePosAndRot = useMemo(() => (player : number): PosAndRotInfo => {
		switch (player) {
			case 1:
				return {
					position: [[ -13, -5, 210],[ -21, -5, 210]],
					rotation: [-Math.PI / 2, 0, 0]
				};
			case 2:
				return {
					position: [[-210, -5, -13],[-210, -5, -21]],
					rotation: [Math.PI / 2, -Math.PI, Math.PI / 2]
				};
			case 3:
				return {
					position: [[ 13, -5,-210],[ 21, -5,-210]],
					rotation: [-Math.PI / 2, 0, -Math.PI]
				};
			case 4:
				return {
					position: [[ 210, -5, 13],[ 210, -5, 21]],
					rotation: [-Math.PI / 2, 0, Math.PI / 2]
				};
			default:
				return {
					position: [[0, 0, 0], [0,0,0]],
					rotation: [0, 0, 0]
				};
		}
	},[]);

	useEffect(() => {
		if (playerState.client !== -1) {

			const { position, rotation } = replacePosAndRot(playerState.client + 1);
			let newPosAndRot = [...posAndRot];
			newPosAndRot[playerState.client].position = position
			newPosAndRot[playerState.client].rotation = rotation
			setPosAndRot(newPosAndRot);
		}
	}, [playerState.client, posAndRot, replacePosAndRot]);

	const getColor = ( ref:  MutableRefObject<Mesh>) => {
		if (ref && ref.current) {
			const material = ref.current.material as MeshBasicMaterial;
			const currentColor = material.color.getHex();
			return (currentColor);
		}
		else
			return ( 0xffffff );
	}

	const getPosition = (position: [number, number, number][], score: number) => {
		const pos = score === 1 || score === 7 ? position[0] : position[1];
		return (pos);
	};

	return (
		<>
			<mesh visible={isScoreVisible} position={ getPosition(posAndRot[0].position, scores.p1Score) } rotation={posAndRot[0].rotation} >
				<textGeometry args={[String(scores.p1Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(bottomPaddleRef) } />
			</mesh>
			<mesh visible={isScoreVisible} position={ getPosition(posAndRot[1].position, scores.p2Score) } rotation={posAndRot[1].rotation} >
				<textGeometry args={[String(scores.p2Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(leftPaddleRef) } />
			</mesh>
			<mesh visible={isScoreVisible} position={ getPosition(posAndRot[2].position, scores.p3Score) } rotation={posAndRot[2].rotation} >
				<textGeometry args={[String(scores.p3Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(topPaddleRef) } />
			</mesh>
			<mesh visible={isScoreVisible} position={ getPosition(posAndRot[3].position, scores.p4Score) } rotation={posAndRot[3].rotation}>
				<textGeometry args={[String(scores.p4Score), {font, size: 35, height: 3}]} />
				<meshBasicMaterial color={ getColor(rightPaddleRef) } />
			</mesh>
		</>
	);
}

export default Scoreboard;