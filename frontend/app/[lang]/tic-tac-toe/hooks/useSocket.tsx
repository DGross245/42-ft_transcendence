import { useContext } from "react"

import { SocketContext } from "../context/TTTSockets"

export const useSocket = () => {
	return ( useContext(SocketContext))
}