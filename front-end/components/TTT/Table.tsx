import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";

export function Table({ position } : {position: [number, number, number]}) {
	const { nodes, materials } = useGLTF("/Models/Table.gltf");

	return (
		<group position={position} dispose={null} scale={[15,15,15]}>
			<mesh
				geometry={(nodes.Plate as Mesh).geometry}
				material={materials.Plate}
				castShadow
				scale={[0.65, 1, 1]}
			/>
			<mesh
				geometry={(nodes.Legs02Left as Mesh).geometry}
				material={materials.Metal}
				position={[-1.5 * 0.65, 0, 0]}
				castShadow
			/>
			<mesh
				geometry={(nodes.Legs02Right as Mesh).geometry}
				material={materials.Metal}
				position={[1.5 * 0.65, 0, 0]}
				castShadow
			/>
		</group>
	);
}

useGLTF.preload("/Modles/Table.gltf");