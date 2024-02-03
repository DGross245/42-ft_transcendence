import { useContext } from "react"

import { PongSocketContext } from "../context/PongSockets"

export const usePongSocket = () => {
	return (useContext(PongSocketContext));
}