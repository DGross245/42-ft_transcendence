import { useContext } from "react"

import { PongGameStateContext } from "../context/PongGameState"

export const usePongGameState = () => {
	return (useContext(PongGameStateContext));
}