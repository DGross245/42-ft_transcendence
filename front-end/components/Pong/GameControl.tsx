import { LeftPaddle, RightPaddle } from "@/app/pong/NormalPaddle"
import { usePongBot } from "@/app/pong/hooks/usePongBot";
import { Ball } from "./Ball";

export const GameControl = () => {
	const { direction, ballAidsHook } = usePongBot();

	return (
		<>
			<RightPaddle direction={direction} />
			<LeftPaddle />
			<Ball onPositionChange={ballAidsHook} />
		</>
	)
}