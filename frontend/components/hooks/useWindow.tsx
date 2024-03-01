import { useEffect, useState } from "react";

export const useWindow = () => {
	//* ------------------------------- state variables ------------------------------ */
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	//* ------------------------------- useEffects ------------------------------ */

	// Updates window dimensions on window resizing
	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		handleResize();

		window.addEventListener('resize', handleResize);

		return (() => {
			window.removeEventListener('resize', handleResize);
		});
	}, []);

	return {dimensions};
};