const GridLine = (props) => {

	return (
		<mesh
			{...props}
			onPointerOver={(e) => { e.stopPropagation()}}
			onClick={(e) => {e.stopPropagation()}}
		>
			<boxGeometry args={[0.5, 17.5, 0.5]} />
			<meshBasicMaterial color={0x333333} />
		</mesh>
	);
}

export default GridLine;