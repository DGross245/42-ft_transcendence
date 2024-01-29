import { useCursor } from '@react-three/drei';
import {useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import Block from './Square';
import X from '../../sharedComponents/X';
import Torus from '../../sharedComponents/Torus';
import { TTTContext } from '../../TTTProvider';

interface FieldProps {
	key: string,
	position: [number, number, number],
	clicked: boolean,
	click: React.Dispatch<React.SetStateAction<boolean>>,
	turn: string,
	board: string [][][],
	setCurrentBoardState: React.Dispatch<React.SetStateAction<string[][][]>>,
	sceneCoords: number[][][][],
	setSceneCoords: React.Dispatch<React.SetStateAction<number[][][][]>>,
	i: number,
	j: number,
	k: number,
	gameOver: boolean,
}

/**
 * The `Field` component represents a individual fields in a three-dimensional tic-tac-toe board.
 * It manages the rendering of the field and the placement of symbols (X or O or 🔳).
 * @param props
 * @returns - A Three.js mesh representing the field with/without a symbol.
 */
const Field : React.FC<FieldProps> = (props, key) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState<string>();
	const { playerState } = useContext(TTTContext);

	useCursor(hovered);
	useCursor(props.clicked);

	const handleHover = ( state: boolean) => {
		if (playerState.players[playerState.client].symbol == props.turn)
			hover(state);
	};

	const handleClick = () => {
		if (!props.clicked && !symbol && playerState.players[playerState.client].symbol === props.turn) {
			props.click(true);
			setSymbol(props.turn);

			// Updates the board state by assigning the symbol to the corresponding position.
			const updatedBoard = [...props.board];
			updatedBoard[props.i][props.j][props.k] = props.turn;
			props.setCurrentBoardState(updatedBoard);

			// Updates the scene coordinates for this field.
			const updateSceneCoords = [...props.sceneCoords];
			updateSceneCoords[props.i][props.j][props.k] = props.position;
			props.setSceneCoords(updateSceneCoords);
		}
	}

	useEffect(() => {
		if (props.board[props.i][props.j][props.k] !== '' && !symbol) {
			setSymbol(props.board[props.i][props.j][props.k]);

			const updateSceneCoords = [...props.sceneCoords];
			updateSceneCoords[props.i][props.j][props.k] = props.position;
			props.setSceneCoords(updateSceneCoords);
			props.click(true);
		}
	}, [props.board]);

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
				<meshBasicMaterial color={0x111111} transparent={true} depthWrite={false}  blending={THREE.AdditiveBlending} visible={hovered && !props.gameOver ? false : true }/>
			</mesh>

			{/* Projects a transparent verison of the symbol on the field the user hovers over based on the current turn */}
			{hovered && !props.clicked && !symbol && props.turn == 'O' && !props.gameOver && (
				<Torus {...props} color={playerState.players[1].color} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !props.clicked && !symbol && props.turn == 'X' && !props.gameOver && (
				<X {...props} color={playerState.players[0].color} transparent={true} />
			)}

			{hovered && !props.clicked && !symbol && props.turn == '🔳' && !props.gameOver && (
				<Block {...props} color={playerState.players[2].color} transparent={true} />
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && symbol == 'O' && (
				<Torus {...props} color={playerState.players[1].color} transparent={false} />
			)}

			{symbol && symbol == 'X' && (
				<X {...props} color={playerState.players[0].color} transparent={false}/>
			)}

			{symbol && symbol == '🔳' && (
				<Block {...props} color={playerState.players[2].color} transparent={false} />
			)}
		</>
	);
}

export default Field