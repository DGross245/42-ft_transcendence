import { useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh } from 'three'

const Ball = ({rightPaddleRef, leftPaddleRef}) => {
	let ref = useRef<Mesh>(null!);
	let ballPosition = { x: 0, y: 0 };
	let ballVelocity = { x: 1, y: 1 };
	const paddleWidth = 4 / 2;
	const paddleHeight = 15;
	const [isVisible, setIsVisible] = useState(true);

	useFrame(() => {
		ballPosition.x += ballVelocity.x;
		ballPosition.y += ballVelocity.y;
		ref.current.position.x = ballPosition.x;
		ref.current.position.y = ballPosition.y;
	
		const rightPaddlePos = rightPaddleRef.current.position;
		const leftPaddlePos = leftPaddleRef.current.position;
	
		const isCollidingWithPaddle = (pos: { x: number; y: number; }) => {
			return (
				ballPosition.x > pos.x - paddleWidth &&
				ballPosition.x < pos.x + paddleWidth &&
				ballPosition.y < pos.y + paddleHeight &&
				ballPosition.y > pos.y - paddleHeight
			);
		}

		const isThroughPaddle =  () => {
			return (
				ballPosition.x > 200 ||
				ballPosition.x < -200
			);
		}
		if (isCollidingWithPaddle(rightPaddlePos) || isCollidingWithPaddle(leftPaddlePos)) {
			ballVelocity.x *= -1;
			const hitRightCorner = Math.abs(ballPosition.x - (rightPaddlePos.x - paddleWidth / 2));
			const hitLeftCorner = Math.abs(ballPosition.x - (leftPaddlePos.x + paddleWidth / 2));
			const isWithinPaddleRange = ballPosition.y < Math.max(rightPaddlePos.y, leftPaddlePos.y) + paddleHeight &&
			ballPosition.y > Math.min(rightPaddlePos.y, leftPaddlePos.y) - paddleHeight;

			if ((hitRightCorner < paddleWidth / 2 || hitLeftCorner < paddleWidth / 2) && isWithinPaddleRange) {
				ballVelocity.y = Math.sign(ballVelocity.y) * Math.abs(ballVelocity.x);
			} else {
				ballVelocity.x *= -1;
				ballVelocity.y *= -1;
			}
		}
	
		if (ballPosition.y > 100 || ballPosition.y < -100) {
			ballVelocity.y *= -1;
		}

		if (isThroughPaddle()) {
			ballPosition.x = 0;
			ballPosition.y = 0;
			ballVelocity = { x: 1, y: 1 };
			setIsVisible(false);
		}

	});
	

	return (
		<mesh ref={ref} visible={isVisible}>
			<boxGeometry args={[4, 4, 4]} />
			<meshBasicMaterial
				color={0xffffff}
				transparent={false}
				blending={THREE.AdditiveBlending}
				side={THREE.BackSide}
			/>
		</mesh>
	);
}

export default Ball;
