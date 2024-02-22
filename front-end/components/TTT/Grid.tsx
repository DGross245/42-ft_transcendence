import { useMemo } from "react";

import GridLine from "./GridLine";

interface PosAndRotTypes {
	position: [number, number, number];
	rotation: [number, number, number];
}

/**
 * Generating mulitple grid lines in a 3D scene. Defines coordinates and rotations for grid lines at specific positions.
 * Utilizes the GridLine component to create lines based on the coordinates and rotations.
 * @returns The generated array of GridLine components for the grid.
 */
export const Grid = () => {
	const posAndRot : PosAndRotTypes[] = useMemo(() => [
		{ position: [ 3, 0, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 0, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 0, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 3, 0,-3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 9, 0, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 0, 9], rotation: [0, 0, Math.PI / 2] },

		{ position: [ 3, 8, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 8, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 8, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 3, 8,-3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 9, 8, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 8, 9], rotation: [0, 0, Math.PI / 2] },

		{ position: [ 3, 16, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 16, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 16, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 3, 16,-3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 9, 16, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 16, 9], rotation: [0, 0, Math.PI / 2] },
	
		{ position: [ 3, 24, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [-3, 24, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 24, 3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 3, 24,-3], rotation: [0, 0, Math.PI / 2] },
		{ position: [ 9, 24, 3], rotation: [Math.PI / 2, 0, 0] },
		{ position: [ 3, 24, 9], rotation: [0, 0, Math.PI / 2] },
	], []);

	const lines = useMemo(() => posAndRot.map((line, index) => (
		<GridLine
			key={index}
			position={line.position}
			rotation={line.rotation}
			args={[0.5, 23.2, 0.5]}
		/>
	)),[posAndRot])

	return (lines);
}