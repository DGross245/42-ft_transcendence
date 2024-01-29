import { useCursor } from '@react-three/drei';
import { useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import Torus from '../../sharedComponents/Torus';
import X from '../../sharedComponents/X';
import { TTTContext } from '../../TTTProvider';
import { useFrame } from '@react-three/fiber';
import { useGameState } from '../hook/useGameState';
import { useSocket } from '../hook/useSocket';
import { GameState } from '../context/GameState';

interface FieldProps {
	key: string,
	position: [number, number, number],
	clicked: boolean,
	click: React.Dispatch<React.SetStateAction<boolean>>,
	i: number,
	j: number,
	k: number,
}

/**
 * The `Field` component represents a individual fields in a three-dimensional tic-tac-toe board.
 * It manages the rendering of the field and the placement of symbols (X or O).
 * @param props - The `props` parameter is an object that contains the following properties:
 * 				  `key`, `position`,`clicked`,`click`,`turn`,`board`, `setCurrentBoardState`, `sceneCoords`,
 * 				  `setSceneCoords`, `i`, `j`, `k` and `gameOver`
 * @returns - A Three.js mesh representing the field with/without a symbol.
 */
const Field : React.FC<FieldProps> = (props) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState<string>();
	const { updateBoard, board, setSceneCoords, sceneCoords, currentTurn, gameState } = useGameState();
	const { playerState } = useSocket();
	const { key, i, j, k, position, click, clicked } = props;

	useCursor(hovered || props.clicked);

	const handleHover = ( state: boolean) => {
		if (playerState.players[playerState.client].symbol == currentTurn)
			hover(state);
	};

	const handleClick = () => {
		if (!clicked && !symbol && playerState.players[playerState.client].symbol === currentTurn) {
			click(true);
			setSymbol(currentTurn);

			// Updates the board state by assigning the symbol to the corresponding position.
			const updatedBoard = [...board];
			updatedBoard[i][j][k] = currentTurn;
			updateBoard(updatedBoard);

			// Updates the scene coordinates for this field.
			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = props.position;
			setSceneCoords(updateSceneCoords);
		}
	}

	useEffect(() => {
		if (board[i][j][k] !== '' && !symbol) {
			setSymbol(board[i][j][k]);

			const updateSceneCoords = [...sceneCoords];
			updateSceneCoords[i][j][k] = position;
			setSceneCoords(updateSceneCoords);
			click(true);
		}
	}, [board]);

	return (
		<>
			<mesh
				{...props}
				rotation={[0, 0, Math.PI / 2]}
				onPointerOver={(e) => { e.stopPropagation(), handleHover(true) }}
				onPointerOut={() => handleHover(false)}
				onClick={(e) => {e.stopPropagation(), handleClick()}}
			>
				<boxGeometry args={[0.5, 5.5, 5.5]} />
				<meshBasicMaterial color={0x111111} transparent={true} depthWrite={false}  blending={THREE.AdditiveBlending} visible={hovered && !gameState.gameOver ? false : true }/>
			</mesh>

			{/* Projects a transparent verison of the symbol on the field the user hovers over based on the current turn */}
			{hovered && !clicked && !symbol && currentTurn == 'O' && !gameState.gameOver && (
				<Torus {...props} color={playerState.players[1].color} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !clicked && !symbol && currentTurn == 'X' && !gameState.gameOver && (
				<X {...props} color={playerState.players[0].color} transparent={true} />
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && (
				<>
					symbol == 'O' ? (
						<Torus {...props} color={playerState.players[1].color} transparent={false} />
					) : symbole == 'X' ? (
						<X {...props} color={playerState.players[0].color} transparent={false}/>
					) : (
						<Square {...props} color={playerState.players[2].color} transparent={false} />
					)
				</>
			)}
		</>
	);
}

export default Field