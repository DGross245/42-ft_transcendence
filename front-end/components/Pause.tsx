import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/react';
import { RightArrowIcon } from './icons';

export const PauseButton = ({ continueIndex, handleButtonClick, maxClient }) => {
	return (
		<Button
			radius="full"
			className={`bg-gradient-to-tr from-zinc-500 to-white-500 text-white shadow-lg ${continueIndex !== 0 ? 'button-with-chip' : 'button-with-arrow'}`}
			size="lg"
			variant="shadow"
			onClick={handleButtonClick}
			isDisabled={continueIndex === maxClient}
			isLoading={continueIndex === maxClient}
		>
			<span
				style={{
					transition: 'margin-right 0.3s ease-out',
					marginRight: '0.3rem',
					display: 'flex',
					alignItems: 'center',
				}}
			>
				{ continueIndex === 0 ? "Continue" : continueIndex === maxClient ? "Starting ..." : "Waiting ..."}
			</span>
			{ continueIndex === 0 && <RightArrowIcon /> }
			{ continueIndex !== 0 && continueIndex !== maxClient && (
				<Chip
					className="chip"
					style={{
						transition: 'opacity 0.3s ease-out',
						opacity: '1',
					}}
					classNames={{
						base: "bg-gradient-to-br from-zinc-600 to-gray-500 border-small shadow-gray-800/30",
						content: "drop-shadow shadow-black text-white",
					}}
					variant='shadow'
				>
					{continueIndex} / {maxClient}
				</Chip>
			)}
		</Button>
	);
};