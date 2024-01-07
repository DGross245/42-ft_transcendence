import { useCursor } from '@react-three/drei';
import {useState } from 'react';
import * as THREE from 'three';
import Block from './Block';
import X from '../../sharedComponents/X';
import Torus from '../../sharedComponents/Torus';

const Field = (props) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState(null);
	useCursor(hovered);
	useCursor(props.clicked);

	const handleClick = () => {
		if (!props.clicked && !symbol) {
			props.click(true);
			setSymbol(props.turn);

			const updatedBoard = [...props.board];
			updatedBoard[props.i][props.j][props.k] = props.turn;
			props.setCurrentBoardState(updatedBoard);

			const updateSceneCoords = [...props.sceneCords];
			updateSceneCoords[props.i][props.j][props.k] = props.position;
			props.setSceneCords(updateSceneCoords);
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

			{hovered && !props.clicked && !symbol && props.turn == 'O' && !props.gameOver && (
				<Torus {...props} color={0x1fcdff} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !props.clicked && !symbol && props.turn == 'X' && !props.gameOver && (
				<X {...props} color={0xff0000} transparent={true} opacity={0.8}/>
			)}

			{hovered && !props.clicked && !symbol && props.turn == '⬜️' && !props.gameOver && (
				<Block {...props} color={0x008000} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

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