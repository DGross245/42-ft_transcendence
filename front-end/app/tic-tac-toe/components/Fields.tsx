import { useCursor } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

const Fields = (props) => {
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
				<meshBasicMaterial color={0x111111} transparent={true} depthWrite={false}  blending={THREE.AdditiveBlending} visible={hovered ? false : true }/>
			</mesh>

			{hovered && !props.clicked && !symbol && props.turn == 'O' && (
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.4, 8, 24]} />
					<meshBasicMaterial color={0x1fcdff} transparent={true} blending={THREE.AdditiveBlending} depthWrite={true} />
				</mesh>
			)}

			{hovered && !props.clicked && !symbol && props.turn == 'X' && (
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

			{symbol && symbol == 'O' && (
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
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
		</>
	);
};

export default Fields
