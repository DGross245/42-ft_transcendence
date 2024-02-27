import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { extend, useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import { MeshStandardMaterial } from 'three';

import { useSound } from '@/components/hooks/Sound';
import { useGameState } from '../../app/[lang]/tic-tac-toe/hooks/useGameState';
import Silkscreen_Regular from '../../public/fonts/Silkscreen_Regular.json';
import { useSocket } from '@/app/[lang]/tic-tac-toe/hooks/useSocket';
import { useEffectDebugger } from '../Pong/PongSocketEvents';

extend({ TextGeometry })

export function lerp(startValue: number, endValue: number, interpolation: number) {
	return startValue * (1 - interpolation) + endValue * interpolation;
}

/**
 * The Countdown component is a timer that counts down from 3 to 1 and displays the count as a 3D text
 * in a React Three Fiber scene.
 * @param  - - `countdownVisible`: a boolean value indicating whether the countdown should be visible
 *				or not.
 *		   - - `setCountdownVisible`: a state setter for setting the countdown state.
 * @returns The Countdown component is returning a mesh that contains a textGeometry and a
 * meshBasicMaterial. The textGeometry displays the value of the count variable, which is initially set
 * to 3 and decrements by 1 every second until it reaches 1. The meshBasicMaterial sets the color of
 * the text to white. The mesh is only visible when the countdownVisible prop is true.
 */
const Countdown = memo(() => {
	const [count, setCount] = useState(3);
	const { camera } = useThree();
	const { playerState } = useSocket();
	const { countdownVisible, setCountdownVisible, gameState, setStarted } = useGameState()
	const font = new FontLoader().parse(Silkscreen_Regular);
	const ref = useRef<THREE.Mesh | null>(null);
	const meshMatRef = useRef<MeshStandardMaterial>(null);
	const playSound = useSound();

	useEffect(() => {
		const meshRef = ref.current;
		if (meshRef) camera.add(meshRef);
		setCount(3);
		var countdownInterval: NodeJS.Timeout;

		if (gameState.pause) {
			if (gameState.gameId !== '-1') {
				setCountdownVisible(true);
			} else {
				if (meshMatRef.current) {
					meshMatRef.current.opacity = 0;
				}
				setCountdownVisible(false);
			}

			return ;
		}

		if (countdownVisible) {
			playSound("countSound");
			countdownInterval = setInterval(() => {
				setCount((prevCount) => {
					if (prevCount > 1) {
						playSound("countSound");
						return (prevCount - 1);
					} else {
						clearInterval(countdownInterval);
						setCountdownVisible(false);
						setStarted(true);
						playSound("end");
						return (1);
					}
				});
			}, 1000);
			
		}
		return () => {
			if (meshRef) {
				camera.remove(meshRef);
			}
			clearInterval(countdownInterval);
		};
	}, [countdownVisible, playSound, gameState.pause, camera, gameState.gameId, setCountdownVisible, setStarted]);

	useFrame(() => {
		if (meshMatRef.current && playerState.client !== -1) {
			meshMatRef.current.opacity = lerp(meshMatRef.current.opacity, countdownVisible ? 1 : 0, 0.05);
		}
	});

	return (
		<mesh ref={ref} visible={countdownVisible} position={[-5, -4, -30]}>
			<textGeometry args={[String(count), {font, size: 10, height: 2}]} />
			<meshStandardMaterial ref={meshMatRef} color={ 0xffffff } transparent />
		</mesh>
	)
});

Countdown.displayName = "Countdown"

export default Countdown;