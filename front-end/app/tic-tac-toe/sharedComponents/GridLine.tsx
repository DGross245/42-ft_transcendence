const GridLine = (props) => {
	return (
		<mesh
			key={props.key}
			position={props.position}
			rotation={props.rotation}
			onPointerOver={(e) => { e.stopPropagation()}}
			onClick={(e) => {e.stopPropagation()}}
		>
			<boxGeometry args={props.args} />
			<meshBasicMaterial color={0x333333} />
		</mesh>
	);
}

export default GridLine;