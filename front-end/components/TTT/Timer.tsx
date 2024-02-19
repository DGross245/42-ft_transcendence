import { Chip, Tooltip } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react"
import { CheckIcon, CrossIcon } from "../icons";
import { useWindow } from "../hooks/useWindow";

export const Timer = ({playerClient, isFull, started, showChip, timerState, setTimerState, disappear, setDisappear }) => {
	const { dimensions } = useWindow();
	const [timer, setTimer] = useState(15);
	const expiredRef = useRef(false);

	useEffect(() => {
		if (playerClient !== -1 && !started) {
			const intervalId = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer > 0 && !isFull) {
						return (prevTimer - 1);
					} else {
						clearInterval(intervalId);
						if (!expiredRef.current) {
							expiredRef.current = true;
							if (prevTimer === 0)
								setTimerState('cross');
							else if (isFull)
								setTimerState('check');

							setTimeout(() => {
								setDisappear(true);
							}, 1500); 

						}
						return (prevTimer);
					}
				});
			}, 1000);
			return () => clearInterval(intervalId);
		}

	}, [playerClient, isFull, started]);

	if (playerClient === -1 && !showChip || started)
		return (null);

	return (
		<div
			className={`chip-container ${disappear ? 'fade-out' : 'fade-in'}`}
			style={{
				position: 'fixed',
				top: dimensions.height / 4,
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
					{ timerState === '' && timer }
				</Chip>
			</Tooltip>
		</div>
	);
};