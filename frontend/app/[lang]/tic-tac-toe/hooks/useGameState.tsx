import { useContext } from "react";

import { GameStateContext } from "../context/TTTGameState";

export const useGameState = () => {
	return ( useContext(GameStateContext) );
}