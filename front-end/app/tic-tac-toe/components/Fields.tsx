import { useCursor } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

const Fields = (props) => {
	const [hovered, hover] = useState(false);
	const [clicked, click] = useState(false);

	useCursor(hovered);
	useCursor(clicked);

	return (
		<>
			<mesh
				{...props}
				rotation={[0, 0, Math.PI / 2]}
				onPointerOver={(e) => { e.stopPropagation(), hover(true) }}
				onPointerOut={() => hover(false)}
				onClick={(e) => {e.stopPropagation(), click(true)}}
			>
				<boxGeometry args={[0.5, 5.5, 5.5]} />
				<meshBasicMaterial color={0x111111} transparent={true} blending={THREE.AdditiveBlending} visible={hovered ? false : true }/>
			</mesh>

			{hovered && !clicked  && (
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.3, 8, 24]} />
					<meshBasicMaterial color={0x0000ffaa} transparent={true} blending={THREE.AdditiveBlending} />
				</mesh>
			)}
			{clicked && (
				<mesh {...props} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[2, 0.3, 8, 24]} />
					<meshBasicMaterial color={0x0000ffff} transparent={false} />
				</mesh>
			)}
		</>
	);
};

export default Fields
