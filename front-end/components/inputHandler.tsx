import { useEffect } from "react"

// interface KeyMap {
// 	[key: string]: boolean;
// }

// export default function inputHandler () {
// 	const keyMap = useRef<KeyMap>({});

// 	useEffect(() => {
// 		const onDocumentKey = (e: KeyboardEvent ) => {
// 			keyMap.current[e.code] = e.type === 'keydown'
// 			e.preventDefault();
// 		}
// 		document.addEventListener('keydown', onDocumentKey)
// 		document.addEventListener('keyup', onDocumentKey)
// 		return () => {
// 			document.removeEventListener('keydown', onDocumentKey)
// 			document.removeEventListener('keyup', onDocumentKey)
// 		}
// 	}, []);

// 	return (keyMap.current);
// }

const pressed: any = []

const useKey = (target: string[], event: (state: boolean) => void) => {
	useEffect(() => {
		const onDocumentKeyUp = (e: KeyboardEvent ) => {
			if (target.indexOf(e.key) !== -1) {
				const isRepeating = !!pressed[e.code as any];
				pressed[e.code as any] = true;
				if (!isRepeating)
					event(true);
			}
		}

		const onDocumentKeyDown = (e: KeyboardEvent ) => {
			if (target.indexOf(e.key) !== -1) {
				pressed[e.code] = false;
				event(false);
			}
		}

		document.addEventListener('keydown', onDocumentKeyUp)
		document.addEventListener('keyup', onDocumentKeyDown)
		return () => {
			document.removeEventListener('keydown', onDocumentKeyUp)
			document.removeEventListener('keyup', onDocumentKeyDown)
		}
	}, [target, event]);
}

export default useKey;