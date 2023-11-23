import { useCursor } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

const Fields = (props) => {
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);
	const [turn, setTurn] = useState('X');
	const [taken, isTaken] = useState(false);

	useCursor(hovered);
	useCursor(clicked);

	const takenCheck = () => {
		if (!taken)
			isTaken(true);
	}

	const turnChange = () => {
		if (turn == 'X')
			setTurn('O');
		else
			setTurn('X');
	}

	return (
		<>
			<mesh
				{...props}
				rotation={[0, 0, Math.PI / 2]}
				onPointerOver={(e) => { e.stopPropagation(), hover(true) }}
				onPointerOut={() => hover(false)}
				onClick={(e) => {e.stopPropagation(), click(true), turnChange()}}
			>
				<boxGeometry args={[0.5, 5.5, 5.5]} />
				<meshBasicMaterial color={0x111111} transparent={true} blending={THREE.AdditiveBlending} visible={hovered ? false : true }/>
			</mesh>

			{hovered && !clicked && turn == 'O' &&(
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.3, 8, 24]} />
					<meshBasicMaterial color={0x0000ffaa} transparent={true} blending={THREE.AdditiveBlending} />
				</mesh>
			)}

			{hovered && !clicked  && turn == 'X' &&(
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
			
			{clicked && !taken && turn == 'O' && (
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]} onClick={takenCheck}>
					<torusGeometry args={[2, 0.3, 8, 24]} />
					<meshBasicMaterial color={0x0000ffff} transparent={false} />
				</mesh>
			)}

			{clicked && !taken && turn == 'X' && (
				<group>
					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / -4]} onClick={takenCheck}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={false} />
					</mesh>

					<mesh {...props} rotation={[Math.PI / 2, 0, Math.PI / 4]} onClick={takenCheck}>
						<boxGeometry args={[5, 1, 0.5]} />
						<meshBasicMaterial color={0xff0000} transparent={false} />
					</mesh>
				</group>
			)}
		</>
	);
};

export default Fields
