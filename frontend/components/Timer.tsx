import { Chip, Tooltip } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react"
import { CheckIcon, CrossIcon } from "./icons";
import { useWindow } from "./hooks/useWindow";
import { useSound } from "./hooks/Sound";


interface TimerProps {
	playerClient: number;
	isFull: string;
	started: boolean;
	showChip: boolean;
	timerState: string;
	setTimerState: React.Dispatch<React.SetStateAction<string>>;
	disappear: boolean;
	setDisappear: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Timer =  React.memo<TimerProps>(({playerClient, isFull, started, showChip, timerState, setTimerState, disappear, setDisappear }) => {
	const { dimensions } = useWindow();
	const [seconds, setSeconds] = useState(15);
	const playSound = useSound();
 

	useEffect(() => {
		if (!showChip) {
			return ;
		}

		if (playerClient !== -1 && !disappear) {
			setDisappear(false);

			const interval = setInterval(() => {
				if (seconds > 0) {
					if (seconds <= 6) {
						playSound("timer");
					} 
					if (isFull) {
						setTimerState('check');

						setTimeout(() => {
							setDisappear(true);
							setSeconds(15);
						}, 1500); 

						clearInterval(interval);
						return ;
					}
					setSeconds(seconds - 1);
				}
				if (seconds === 0) {
					setTimerState('cross');

					setTimeout(() => {
						setDisappear(true);
						setSeconds(15);
					}, 1500); 
				}
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [isFull, playerClient, seconds, showChip, disappear, setDisappear, setTimerState, playSound]);

	if (playerClient === -1 || !showChip || started) {
		return (null);
	}

	return (
		<div
			className={`${disappear ? 'fade-out' : 'fade-in'}`}
			style={{
				position: 'absolute',
				top: dimensions.height / 4.5,
				left: dimensions.width / 2,
				transform: 'translate(-50%, -50%)',
			}}
		>
			<Tooltip
				showArrow={true}
				content="Join timer"
				delay={0}
				closeDelay={0}
			>
				<Chip variant="bordered" style={{ borderColor: '#f6f4ff' }}>
					{ timerState === 'check' && <CheckIcon className="fade-in" /> }
					{ timerState === 'cross' && <CrossIcon className="fade-in"/> }
					{ timerState === '' && seconds }
				</Chip>
			</Tooltip>
		</div>
	);
});

Timer.displayName = "Timer"