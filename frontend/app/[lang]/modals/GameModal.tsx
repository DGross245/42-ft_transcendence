import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { ArrowRightIcon, PauseIcon } from "@heroicons/react/24/solid";
import styles from "./Modals.module.css";
import clsx from "clsx";
import { RightArrowIcon } from "@/components/icons";

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */
interface GameModalButtonProps {
	onClick?: () => void,
	children?: React.ReactNode | string,
	isDisabled?: boolean,
	isLoading?: boolean,
	className?: string
}

enum GameResult {
	Winner,
	Looser,
	Draw,
	Paused
}
interface PauseButtonProps {
	onClick: () => void,
	currentClients: number,
	maxClients: number
}
interface GameWinningModalProps {
	isOpen: boolean,
	gameResult?: GameResult,
	loading?: boolean,
	rematch?: () => void,
	nextGame?: () => void,
	quit?: () => void,
	queue?: () => void,
	pauseInfo?: PauseButtonProps
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
const GameModalButton: React.FC<GameModalButtonProps> = ({ onClick, children, isDisabled, isLoading, className }) => {
	return (
		<Button
			size="md"
			radius="lg"
			color="primary"
			variant="shadow"
			onClick={onClick}
			className={`text-lg ${className ? className : ""}`}
			isDisabled={isDisabled}
			isLoading={isLoading}
		>
			{children}
		</Button>
	)
}

const InfoText: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
	return (
		<h1 className={clsx("font-bold text-3xl uppercase", className)}>
			{children}
		</h1>
	)
}

const GameModal: React.FC<GameWinningModalProps> = ({ isOpen, gameResult, loading, rematch, nextGame, queue, quit, pauseInfo }) => {
	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			placement="center"
			closeButton={<></>}
			isDismissable={false}
			isKeyboardDismissDisabled={true}
			>
			<ModalContent>
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg" />
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					{gameResult == GameResult.Winner	&& <h1 className={styles.emojiIcon}>🏆</h1>}
					{gameResult == GameResult.Looser	&& <h1 className={styles.emojiIcon}>😕</h1>}
					{gameResult == GameResult.Draw		&& <h1 className={styles.emojiIcon}>➖</h1>}
					{gameResult == GameResult.Paused	&& <h1 className={styles.emojiIcon}>⏱️</h1>}
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					<div className="flex justify-center">
						{gameResult == GameResult.Winner	&& <InfoText className="text-green-500">Winner</InfoText>}
						{gameResult == GameResult.Looser	&& <InfoText className="text-red-500">Looser</InfoText>}
						{gameResult == GameResult.Draw		&& <InfoText className="text-yellow-500">Draw</InfoText>}
						{gameResult == GameResult.Paused	&& (
							<div className="flex items-center">
								<PauseIcon className="inline-block w-12 h-12"/>
								<InfoText>Pause</InfoText>
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					{rematch	&& <GameModalButton onClick={rematch}>Rematch</GameModalButton>}
					{nextGame	&& <GameModalButton onClick={nextGame}>Next Match</GameModalButton>}
					{queue		&& <GameModalButton onClick={queue}>Queue</GameModalButton>}
					{quit		&& <GameModalButton onClick={quit}>Quit</GameModalButton>}
					{pauseInfo	&& (
						<GameModalButton
							onClick={pauseInfo.onClick}
							isDisabled={pauseInfo.currentClients === pauseInfo.maxClients}
							isLoading={pauseInfo.currentClients === pauseInfo.maxClients}
							className={`${styles.buttonWithArrow} ${styles.gradientButton}`}
						>
							{pauseInfo.currentClients === 0 && (<>
								<span>Continue</span>
								<RightArrowIcon /> 
							</>)}
							{pauseInfo.currentClients !== 0 && (<>
								<span>
								 	{pauseInfo.currentClients === pauseInfo.maxClients ? "Starting" : "Waiting"}
								</span>
								<div className="-ml-[6px]">
									<span className={styles.loadingDot}/>
									<span className={styles.loadingDot}/>
									<span className={styles.loadingDot}/>
								</div>
							</>)}
							{ pauseInfo.currentClients !== 0 && pauseInfo.currentClients !== pauseInfo.maxClients && (
								<Chip variant="shadow">
									{pauseInfo.currentClients} / {pauseInfo.maxClients}
								</Chip>
							)}
						</GameModalButton>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default GameModal;
export { GameResult };
