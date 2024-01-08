import { useCursor } from '@react-three/drei';
import {useState } from 'react';
import * as THREE from 'three';
import Block from './Block';
import X from '../../sharedComponents/X';
import Torus from '../../sharedComponents/Torus';

/**
 * The `Field` component represents a individual fields in a three-dimensional tic-tac-toe board.
 * It manages the rendering of the field and the placement of symbols (X or O or ⬜️).
 * @param props
 * @returns - A Three.js mesh representing the field with/without a symbol.
 */
const Field = (props) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState(null);
	useCursor(hovered);
	useCursor(props.clicked);

	const handleClick = () => {
		if (!props.clicked && !symbol) {
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

	return (
		<>
			<mesh
				{...props}
				rotation={[0, 0, Math.PI / 2]}
				onPointerOver={(e) => { e.stopPropagation(), hover(true) }}
				onPointerOut={() => hover(false)}
				onClick={(e) => {e.stopPropagation(), handleClick()}}
			>
				<boxGeometry args={[0.5, 5.5, 5.5]} />
				<meshBasicMaterial color={0x111111} transparent={true} depthWrite={false}  blending={THREE.AdditiveBlending} visible={hovered && !props.gameOver ? false : true }/>
			</mesh>

			{/* Projects a transparent verison of the symbol on the field the user hovers over based on the current turn */}
			{hovered && !props.clicked && !symbol && props.turn == 'O' && !props.gameOver && (
				<Torus {...props} color={0x1fcdff} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !props.clicked && !symbol && props.turn == 'X' && !props.gameOver && (
				<X {...props} color={0xff0000} transparent={true} opacity={0.8}/>
			)}

			{hovered && !props.clicked && !symbol && props.turn == '⬜️' && !props.gameOver && (
				<Block {...props} color={0x008000} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && symbol == 'O' && (
				<Torus {...props} color={0x1fcdff} transparent={false} />
			)}

			{symbol && symbol == 'X' && (
				<X {...props} color={0xff0000} transparent={false}/>
			)}

			{symbol && symbol == '⬜️' && (
				<Block {...props} color={0x008800} transparent={false} />
			)}
		</>
	);
}

export default Field