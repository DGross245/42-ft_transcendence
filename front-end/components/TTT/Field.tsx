import { memo, useMemo } from 'react';
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
const Field : React.FC<FieldProps> = memo((props) => {
	const { playerState} = useSocket();
	const { currentTurn, gameState, countdownVisible } = useGameState();
	const { hovered, handleClick, handleHover, symbol } = useField(props);

	const colors = useMemo(() => {
		const getColorBySymbol = (symbol: string) => {
			const player = playerState.players.find(player => player.symbol === symbol);
			return player?.color;
		};
	
		return [
			getColorBySymbol('X'),
			getColorBySymbol('O'),
			getColorBySymbol('🔳'),
		];
	}, [playerState.players]);

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

			{hovered && !symbol && currentTurn == 'X' && !gameState.gameOver && !gameState.pause && !countdownVisible && (
				<X {...props} color={colors[0]} transparent={true} />
			)}

			{hovered && !symbol && currentTurn == 'O' && !gameState.gameOver && !gameState.pause && !countdownVisible && (
				<Torus {...props} color={colors[1]} transparent={true} />
			)}

			{hovered && !symbol && currentTurn == '🔳' && !gameState.gameOver && !gameState.pause && !countdownVisible && (
				<Square {...props} color={colors[2]} transparent={true} />
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && (
				<>
					{symbol === 'X' ? (
						<X {...props} color={colors[0]} transparent={false} />
					) : symbol === 'O' ? (
						<Torus {...props} color={colors[1]} transparent={false} />
					) : (
						<Square {...props} color={colors[2]} transparent={false} />
					)}
				</>
			)}
		</>
	);
});

Field.displayName = "Field"

export default Field