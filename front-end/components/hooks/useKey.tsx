import { useCallback, useEffect, useState } from "react";

import { useGameState } from "../../app/tic-tac-toe/hooks/useGameState";

export const useKey = (key: string | string []) => {
	const [isKeyDown, setKeyDown] = useState(false);
	const keys = Array.isArray(key) ? key : [key];
	//const { gameState } = useGameState();

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
	}, [onKeyDown, onKeyUp, keys]);

	return { isKeyDown }
};