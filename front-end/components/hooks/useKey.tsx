import { useCallback, useEffect, useState } from "react";

export const useKey = (key: string | string []) => {
	const [isKeyDown, setKeyDown] = useState(false);
	const keys = Array.isArray(key) ? key : [key];

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (!isKeyDown && keys.includes(e.key))
			setKeyDown(true);
	},[...keys, isKeyDown]);

	const onKeyUp = useCallback((e: KeyboardEvent) => {
		if (isKeyDown && keys.includes(e.key))
			setKeyDown(false);
	},[...keys, isKeyDown]);

	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);
		};
	}, [keys, isKeyDown, onKeyDown, onKeyUp]);

	return { isKeyDown }
};