import * as THREE from "three"

const Border = () => {

	const info = [
		{ position: {x: 131, y:  151, z: 0}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x: 151, y:  131, z: 0}, rotation: {x: 0, y: 0, z: Math.PI / 2} },
		{ position: {x:-131, y:  151, z: 0}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x:-151, y:  131, z: 0}, rotation: {x: 0, y: 0, z: Math.PI / 2} },
		{ position: {x:-131, y: -151, z: 0}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x:-151, y: -131, z: 0}, rotation: {x: 0, y: 0, z: Math.PI / 2} },
		{ position: {x: 131, y: -151, z: 0}, rotation: {x: 0, y: 0, z: 0} },
		{ position: {x: 151, y: -131, z: 0}, rotation: {x: 0, y: 0, z: Math.PI / 2} },
	];

	const borders = info.map((border, index) => (
		<mesh
			key={index}
			position={[border.position.x, border.position.y, border.position.z]}
			rotation={[border.rotation.x, border.rotation.y, border.rotation.z]} >
			<boxGeometry args={[40, 4, 4]} />
			<meshBasicMaterial
				color={ 0xffffff }
				toneMapped={false}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	));

	return (borders);
}

export default Border;