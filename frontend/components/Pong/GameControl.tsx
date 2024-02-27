import { LeftPaddle, RightPaddle } from "@/components/Pong/NormalPaddle"
import { usePongBot } from "@/app/[lang]/pong/hooks/usePongBot";
import { PongBall } from "./PongBall";

export const GameControl = () => {
	const { direction, ballAidsHook } = usePongBot();

	return (
		<>
			<RightPaddle direction={direction} />
			<LeftPaddle />
			<PongBall onPositionChange={ballAidsHook} />
		</>
	)
}