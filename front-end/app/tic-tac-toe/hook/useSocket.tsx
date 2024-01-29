import { useContext } from "react"

import { SocketContext } from "../context/Sockets"

export const useSocket = () => {
	return ( useContext(SocketContext))
}