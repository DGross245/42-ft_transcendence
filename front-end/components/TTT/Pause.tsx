import { Button } from '@nextui-org/button';
import {Chip } from '@nextui-org/react';

import { useSocket } from '@/app/tic-tac-toe/hooks/useSocket';
import { useGameState } from '@/app/tic-tac-toe/hooks/useGameState';

export const PauseButton = () => {
	// Provider hooks
	const {
		continueIndex,
		setSendContinueRequest,
	} = useSocket();
	const {
		isGameMode,
		gameState
	} = useGameState();

	const handleButtonClick = () => {
		setSendContinueRequest(true);
	};

	if (!gameState.pause || (gameState.pause && gameState.gameOver) || (gameState.pause && gameState.gameId === '-1'))
		return (null)

	return (
		<Button
			radius="full"
			className={`bg-gradient-to-tr from-zinc-500 to-white-500 text-white shadow-lg ${continueIndex !== 0 ? 'button-with-chip' : ''}`}
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				transition: 'width 0.3s ease-out, height 0.3s ease-out',
				height: continueIndex !== 0 ? '3rem' : '2rem',
			}}
			size="lg"
			variant="shadow"
			onClick={handleButtonClick}
		>
			<span
				style={{
					transition: 'margin-right 0.3s ease-out',
					marginRight: continueIndex !== 0 ? '0.5rem' : '0',
				}}
			>
				Continue
			</span>
			{continueIndex !== 0 && (
				<Chip
					className="chip"
					style={{
						transition: 'opacity 0.3s ease-out', // Add transition for chip opacity
						opacity: '1', // Set initial opacity to 1 when chip is shown
					}}
					classNames={{
						base: "bg-gradient-to-br from-zinc-600 to-gray-500 border-small shadow-gray-800/30",
						content: "drop-shadow shadow-black text-white",
					}}
					variant='shadow'
				>
					{continueIndex} / {isGameMode ? 3 : 2}
				</Chip>
			)}
		</Button>
	);
};