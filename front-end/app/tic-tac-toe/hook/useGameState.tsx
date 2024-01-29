import { useContext } from "react";

import { GameStateContext } from "../context/GameState";

export const useGameState = () => {
	return ( useContext(GameStateContext) );
}