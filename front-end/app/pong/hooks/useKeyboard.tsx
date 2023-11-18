// import { useEffect, useState } from "react"

// export const UserInput = () => {
// 	const [input, setInput] = useState({
// 		leftPaddleUp: false,
// 		leftPaddleDown: false,
// 		rightPaddleUp: false,
// 		rightPaddleDown: false,
// 	});

// 	const keys = {
// 		KeyW: "leftPaddleUp",
// 		KeyS: "leftPaddleDown",
// 		ArrowUp: "rightPaddleUp",
// 		ArrowDown: "rightPaddleDown",
// 	};

// 	const findKey = (key: string) => keys[key];

// 	useEffect(() => {
// 		const handleKeyDown = (e: KeyboardEvent) => {
// 			setInput((m) => ({ ...m, [findKey(e.code)]: true}))
// 		}
// 		const handleKeyUp = (e: KeyboardEvent) => {
// 			setInput((m) => ({ ...m, [findKey(e.code)]: false}))
// 		}
// 		document.addEventListener('keydown', handleKeyDown);
// 		document.addEventListener('keyup', handleKeyUp);
// 		return () => {
// 			document.removeEventListener("keydown", handleKeyDown);
// 			document.removeEventListener("keyup", handleKeyUp);
// 		}
// 	}, []);

// 	return input;
// }

import { useEffect, useRef } from 'react'

export default function useKeyboard() {
  const keyMap = useRef({})

  useEffect(() => {
    const onDocumentKey = (e) => {
      keyMap.current[e.code] = e.type === 'keydown'
    }
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)
    return () => {
      document.removeEventListener('keydown', onDocumentKey)
      document.removeEventListener('keyup', onDocumentKey)
    }
  })

  return keyMap.current
}