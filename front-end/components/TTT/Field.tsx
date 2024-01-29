import { useCursor } from '@react-three/drei';
import * as THREE from 'three';

import { useGameState } from '../../app/tic-tac-toe/hook/useGameState';
import { useSocket } from '../../app/tic-tac-toe/hook/useSocket';
import { useField } from '../../app/tic-tac-toe/hook/useField';
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
				<X {...props} color={playerState.players[0].color} transparent={true} />
			)}

			{hovered && !clicked && !symbol && currentTurn == 'O' && !gameState.gameOver && (
				<Torus {...props} color={playerState.players[1].color} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{hovered && !clicked && !symbol && currentTurn == '🔳' && !gameState.gameOver && (
				<Square {...props} color={playerState.players[2].color} transparent={true} />
			)}

			{/* Projects the symbol on the field the user click on based on the turn the player clicked (symbol) */}
			{symbol && (
				<>
					{symbol === 'X' ? (
						<X {...props} color={playerState.players[0].color} transparent={false}/>
					) : symbol === 'O' ? (
						<Torus {...props} color={playerState.players[1].color} transparent={false} />
					) : (
						<Square {...props} color={playerState.players[2].color} transparent={false} />
					)}
				</>
			)}
		</>
	);
}

export default Field