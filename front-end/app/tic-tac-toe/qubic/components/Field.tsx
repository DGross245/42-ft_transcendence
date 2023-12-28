import { useCursor } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import Triangle from './Block';

const Field = (props) => {
	const [hovered, hover] = useState(false);
	const [symbol, setSymbol] = useState(null);
	useCursor(hovered);
	useCursor(props.clicked);
	const ref = useRef();

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
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.4, 8, 24]} />
					<meshBasicMaterial color={0x1fcdff} transparent={true} blending={THREE.AdditiveBlending}/>
				</mesh>
			)}

			{hovered && !props.clicked && !symbol && props.turn == 'X' && !props.gameOver && (
				<group>
					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / -4]}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={true} blending={THREE.AdditiveBlending} />
					</mesh>

					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={true} blending={THREE.AdditiveBlending} />
					</mesh>
				</group>
			)}

			{hovered && !props.clicked && !symbol && props.turn == '⬜️' && !props.gameOver && (
				<Triangle {...props} color={0x008000} transparent={true} blending={THREE.AdditiveBlending}/>
			)}

			{symbol && symbol == 'O' && (
				<mesh {...props} ref={ref} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.4, 8, 24]} />
					<meshBasicMaterial color={0x1aabff} transparent={false} fog={true}/>
				</mesh>
			)}

			{symbol && symbol == 'X' && (
				<group>
					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / -4]}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={false} />
					</mesh>

					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={false} />
					</mesh>
				</group>
			)}

			{symbol && symbol == '⬜️' && (
				<Triangle {...props} color={0x008000} transparent={false} blending={0} />
			)}
		</>
	);
}

export default Field