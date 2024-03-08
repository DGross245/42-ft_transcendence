import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, Shape } from 'three';
import { Extrude } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { useSocket } from "@/app/[lang]/tic-tac-toe/hooks/useSocket";
import { useGameState } from "@/app/[lang]/tic-tac-toe/hooks/useGameState";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

/**
 * The TurnDisplay component renders a 3D display of the current currentTurn in a game, with different shapes
 * and colors representing different players.
 * @returns The `TurnDisplay` component is returning a group of mesh objects representing the current
 * currentTurn in a game. The returned JSX structure includes multiple mesh objects, each representing a
 * different shape (X, O, or a square) and positioned accordingly. The position, scale
 * properties of each mesh object are determined based on the `currentTurn`.
 */
const TurnDisplay = () => {
	//* ------------------------------- ref & hooks ------------------------------ */
	const ref = useRef<THREE.Group | null>(null);
	const { camera } = useThree();
	const { playerState } = useSocket();
	const { isGameMode, currentTurn } = useGameState();

	//* ------------------------------- functions ------------------------------ */

	/* The `colors` constant memoizes the calculation of colors based on the
	player symbols ('X', 'O', '🔳') in the game */
	const colors = useMemo(() => {
		const getColorBySymbol = (symbol: string) => {
			const player = playerState.players.find(player => player.symbol === symbol);
			return ( player ? player.color : 0xffffff );
		};
	
		return [
			getColorBySymbol('X'),
			getColorBySymbol('O'),
			getColorBySymbol('🔳'),
		];
	}, [playerState.players]);

	const extrudeSettings = {
		steps: 2,
		depth: 0.75,
		bevelEnabled: false,
	};

	/* The `boxShape` constant memoizes the creation of a custom shape for a
	3D box with a hole in it */
	const boxShape = useMemo(() => {
		const boxShape = new Shape();

		boxShape.moveTo(-2.3, -2.3);
		boxShape.lineTo(-2.3, 2.3);
		boxShape.lineTo(2.3, 2.3);
		boxShape.lineTo(2.3, -2.3);

		const holeShape = new Shape();
		holeShape.moveTo(-1.5, -1.5);
		holeShape.lineTo(-1.5, 1.5);
		holeShape.lineTo(1.5, 1.5);
		holeShape.lineTo(1.5, -1.5);

		boxShape.holes.push(holeShape);
		return boxShape;
	}, []);


	/* The `xShape` constant memoizes the creation of a custom shape
	representing the 'X' symbol in the game */
	const xShape = useMemo(() => {
		const shape = new Shape();
		
		shape.moveTo(-2.3, -1.7);
		shape.lineTo(-1.3, -0.7);
		shape.lineTo(0, -2);
		shape.lineTo(1.3, -0.7);
		shape.lineTo(2.3, -1.7);
		shape.lineTo(1, -3);
		shape.lineTo(2.3, -4.3);
		shape.lineTo(1.3, -5.3);
		shape.lineTo(0, -4);
		shape.lineTo(-1.3, -5.3);
		shape.lineTo(-2.3, -4.3);
		shape.lineTo(-1, -3);
		shape.lineTo(-2.3, -1.7);
		
		return shape;
	}, []);

	//* ------------------------------- useEffects ------------------------------ */

	/* This `useEffect` hook  is responsible for binding the 3D mesh objects
	represented by the `TurnDisplay` component to the camera in the scene */
	useEffect(() => {
		const meshRef = ref.current;
		if (meshRef) {
			camera.add(meshRef);
		}
	
		return () => {
			if (meshRef) {
				camera.remove(meshRef);
			}
		};
	}, [camera]);

	return (
		<group ref={ref} scale={[0.4, 0.4, 0.4]}>
			{ isGameMode ? (

				// 'TurnDisplay' for the GameMode 'Qubic' with 3 Smybols 'X', 'O', '🔳'.
				<>
					{/* 'X' symbol */}
					<mesh 
						position={currentTurn === 'X' ? [-5, 15.5, -30] : [-5, 15, -30]}
						scale={currentTurn === 'X' ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
					>
						<Extrude args={[xShape, extrudeSettings]}>
							<meshBasicMaterial 
								color={colors[0]}
								side={DoubleSide}
								opacity={currentTurn === 'X' ? 0.8 : 0.4}
								transparent={true}
							/>
						</Extrude>
					</mesh>

					{/* Dots symbols ':' to the right of 'X' */}
					<mesh position={[-2.5, 14, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>
					<mesh position={[-2.5, 13, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>

					{/* 'O' symbol */}
					<mesh
						position={currentTurn ? [0, 13.6, -30] : [0, 13.6, -30]}
						scale={currentTurn === 'O' ? [0.65, 0.65, 0.65] : [0.6, 0.6, 0.6]}>
						<torusGeometry args={[2, 0.4, 8, 24]} />
						<meshBasicMaterial
							color={colors[1]}
							transparent={true}
							opacity={currentTurn === 'O' ? 1 : 0.4}
						/>
					</mesh>

					{/* Dots symbols ':' to the right of 'O' */}
					<mesh position={[2.5, 14, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>
					<mesh position={[2.5, 13, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>

					{/* '🔳' symbol */}
					<mesh
						position={[5, 13.5, -30]}
						scale={currentTurn === '🔳' ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
					>
						<Extrude args={[boxShape, extrudeSettings]}>
							<meshBasicMaterial
								color={colors[2]}
								transparent={true}
								side={DoubleSide}
								opacity={currentTurn === '🔳' ? 1 : 0.4}
							/>
						</Extrude>
					</mesh>
				</>
			) : (

				// 'TurnDisplay' for the normal mode 'TTT'
				<>
					{/* 'X' symbol */}
					<mesh 
						position={currentTurn === 'X' ? [-2.5, 15.5, -30] : [-2.5, 15, -30]}
						scale={currentTurn === 'X' ? [0.7, 0.7, 0.7] : [0.5, 0.5, 0.5]}
					>
						<Extrude args={[xShape, extrudeSettings]}>
							<meshBasicMaterial 
								color={colors[0]}
								side={DoubleSide}
								opacity={currentTurn === 'X' ? 0.8 : 0.4}
								transparent={true}
							/>
						</Extrude>
					</mesh>

					{/* Dots symbols ':' to the right of 'X' */}
					<mesh position={[0, 14, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>
					<mesh position={[0, 13, -30]} scale={[0.1, 0.1, 0.1]}>
						<boxGeometry args={[4, 4, 4]} />
						<meshBasicMaterial color={ 0xffffff } />
					</mesh>

					{/* 'O' symbol */}
					<mesh
						position={currentTurn === 'O' ? [2.7, 13.6, -30] : [2.7, 13.6, -30]}
						scale={currentTurn === 'O' ? [0.8, 0.8, 0.8] : [0.6, 0.6, 0.6]}
					>
						<torusGeometry args={[2, 0.4, 8, 24]} />
						<meshBasicMaterial
							color={colors[1]}
							transparent={true}
							opacity={currentTurn === 'O' ? 1 : 0.4}
						/>
					</mesh>
				</>
			)}
		</group>
	);
}

export default TurnDisplay