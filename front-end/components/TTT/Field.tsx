import { useCursor } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

import { useGameState } from '../../app/tic-tac-toe/hooks/useGameState';
import { useSocket } from '../../app/tic-tac-toe/hooks/useSocket';
import { useField } from '../../app/tic-tac-toe/hooks/useField';
import X from './X';
import Torus from './Torus';
import Square from './Square';

export interface FieldProps {
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
	const { clicked } = props;
	const { playerState} = useSocket();
	const { currentTurn, gameState } = useGameState();
	const { hovered, handleClick, handleHover, symbol } = useField(props);
	
	const getColorBySymbol = (symbol: string) => {
		const player = playerState.players.find(player => player.symbol === symbol);
		return player?.color;
	};

	const colors = useMemo (() => [
		getColorBySymbol('X'),
		getColorBySymbol('O'),
		getColorBySymbol('🔳'),
	],[playerState]);

	useCursor(hovered);
	useCursor(clicked);

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

			{hovered && !clicked && !symbol && currentTurn == 'X' && !gameState.gameOver && (
				<X {...props} color={colors[0]} transparent={true} />
			)}

			{hovered && !clicked && !symbol && currentTurn == 'O' && !gameState.gameOver && (
				<Torus {...props} color={colors[1]} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !clicked && !symbol && currentTurn == '🔳' && !gameState.gameOver && (
				<Square {...props} color={colors[2]} transparent={true} />
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && (
				<>
					{symbol === 'X' ? (
						<X {...props} color={colors[0]} transparent={false}/>
					) : symbol === 'O' ? (
						<Torus {...props} color={colors[1]} transparent={false} />
					) : (
						<Square {...props} color={colors[2]} transparent={false} />
					)}
				</>
			)}
		</>
	);
}

export default Field