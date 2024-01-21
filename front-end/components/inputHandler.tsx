import { useEffect, useRef } from "react"

interface KeyMap {
	[key: string]: boolean;
}

// TODO: change inputHandler to hook

export default function inputHandler () {
	const keyMap = useRef<KeyMap>({});

	useEffect(() => {
		const onDocumentKey = (e: KeyboardEvent ) => {
			keyMap.current[e.code] = e.type === 'keydown'
			e.preventDefault();
		}
		document.addEventListener('keydown', onDocumentKey)
		document.addEventListener('keyup', onDocumentKey)
		return () => {
			document.removeEventListener('keydown', onDocumentKey)
			document.removeEventListener('keyup', onDocumentKey)
		}
	}, []);

	return (keyMap.current);
}