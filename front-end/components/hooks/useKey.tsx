import { useCallback, useEffect, useState } from "react";

export const useKey = (key: string | string []) => {
	const [isKeyDown, setKeyDown] = useState(false);

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		const keys = Array.isArray(key) ? key : [key];
		if (!isKeyDown && keys.includes(e.key))
			setKeyDown(true);
	}, [isKeyDown, key]);

	const onKeyUp = useCallback((e: KeyboardEvent) => {
		const keys = Array.isArray(key) ? key : [key];
		if (isKeyDown && keys.includes(e.key))
			setKeyDown(false);
	}, [isKeyDown, key]);

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
		};
	}, [isKeyDown, onKeyDown, onKeyUp]);

	return { isKeyDown }
};
