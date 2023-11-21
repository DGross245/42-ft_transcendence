import { useRef, useState } from "react";
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Mesh } from 'three'

const Ball = ({rightPaddleRef, leftPaddleRef, updateScore, currentScore}) => {
	let ref = useRef<Mesh>(null!);
	let ballPosition = { x: 0, y: 0 };
	let ballVelocity = { x: 2, y: 2 };
	const paddleWidth = 4 / 2;
	const paddleHeight = 15;
	let p1Score = currentScore.p1;
	let p2Score = currentScore.p2;
	//const [isVisible, setIsVisible] = useState(true);

	useFrame((_, delta) => {
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

		// ball logic still skuft
		if (isCollidingWithPaddle(rightPaddlePos) || isCollidingWithPaddle(leftPaddlePos)) {
			let MaxBounceAngle = 5 *  Math.PI / 12;
			const hitRightCorner = Math.abs(ballPosition.x - (rightPaddlePos.x - paddleWidth));
			const hitLeftCorner = Math.abs(ballPosition.x - (leftPaddlePos.x + paddleWidth));
			const isWithinPaddleRange = ballPosition.y < Math.max(rightPaddlePos.y, leftPaddlePos.y) + paddleHeight &&
			ballPosition.y > Math.min(rightPaddlePos.y, leftPaddlePos.y) - paddleHeight;
			
			if ((hitRightCorner < paddleWidth || hitLeftCorner < paddleWidth ) && isWithinPaddleRange) {
				let relativeIntersectY, normalizedRelativeIntersectionY, bounceAngle, ballSpeed;

				if (isCollidingWithPaddle(rightPaddlePos))
					relativeIntersectY = (rightPaddlePos.y +(paddleHeight)) - ballPosition.y;
				else
					relativeIntersectY = (leftPaddlePos.y +(paddleHeight)) - ballPosition.y;

				normalizedRelativeIntersectionY = (relativeIntersectY/(paddleHeight));
				bounceAngle = normalizedRelativeIntersectionY * MaxBounceAngle;
				ballSpeed = normalizedRelativeIntersectionY * 2;

				ballVelocity.x = ballSpeed*Math.cos(bounceAngle);
				ballVelocity.y = ballSpeed*-Math.sin(bounceAngle);
				
			} else {
				ballVelocity.x *= -1;
				ballVelocity.y *= -1;
			}
		}
	
		if (ballPosition.y > 100 || ballPosition.y < -100) {
			ballVelocity.y *= -1;
		}

		if (isThroughPaddle()) {
			if (ballPosition.x > 200)
				++p1Score;
			else
				++p2Score;
			ballPosition.x = 0;
			ballPosition.y = 0;
			ballVelocity = { x: 2, y: 2 };
			updateScore({ p1: p1Score, p2: p2Score });
		}

	});
	

	return (
		<mesh ref={ref}>
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
