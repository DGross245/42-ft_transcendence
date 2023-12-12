const Table = () => {
	return (
		<>
			<mesh position={[0 , -1.5, 0]} >
				<boxGeometry args={[30, 2, 30]} />
				<meshBasicMaterial color={0x8B4513}/>
			</mesh>

			<mesh position={[12 , -12.5, 12]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[20, 4, 4]} />
				<meshBasicMaterial color={0x8B4513}/>
			</mesh>

			<mesh position={[-12 , -12.5, 12]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[20, 4, 4]} />
				<meshBasicMaterial color={0x8B4513}/>
			</mesh>

			<mesh position={[-12 , -12.5, -12]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[20, 4, 4]} />
				<meshBasicMaterial color={0x8B4513}/>
			</mesh>

			<mesh position={[12 , -12.5, -12]} rotation={[0, 0, Math.PI / 2]}>
				<boxGeometry args={[20, 4, 4]} />
				<meshBasicMaterial color={0x8B4513}/>
			</mesh>
		</>
	);
}

export default Table