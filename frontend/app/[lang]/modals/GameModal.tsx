import { Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import { PauseIcon } from "@heroicons/react/24/solid";
import { RightArrowIcon } from "@/components/icons";
import ModalButton from "./components/ModalButton";
import { useTranslation } from "@/app/i18n";
import styles from "./Modals.module.css";
import clsx from "clsx";
import LoadingButton from "./components/LoadingButton";

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */
enum GameResult {
	Winner,
	Loser,
	Draw,
	Paused
}
enum Status {
	Disconnected,
	Left,
	Unavailable
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
	nextGame?: () => Promise<void>,
	quit?: () => void,
	queue?: () => Promise<void>,
	pauseInfo?: PauseButtonProps,
	status?: Status,
	buttonLoading?: boolean,
	disableButton?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
const InfoText: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
	return (
		<h1 className={clsx("font-bold text-3xl uppercase", className)}>
			{children}
		</h1>
	)
}

const GameModal: React.FC<GameWinningModalProps> = ({ isOpen, disableButton, gameResult, loading, rematch, nextGame, queue, quit, pauseInfo, status, buttonLoading }) => {
	const { t } = useTranslation("modals");

	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			placement="center"
			isDismissable={false}
			hideCloseButton={true}
			isKeyboardDismissDisabled={true}
			>
			<ModalContent>
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg" />
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					{gameResult == GameResult.Winner	&& <h1 className={styles.emojiIcon}>🏆</h1>}
					{gameResult == GameResult.Loser		&& <h1 className={styles.emojiIcon}>😕</h1>}
					{gameResult == GameResult.Draw		&& <h1 className={styles.emojiIcon}>➖</h1>}
					{gameResult == GameResult.Paused	&& <h1 className={styles.emojiIcon}>⏱️</h1>}
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					<div className="flex justify-center">
						<div className="mb-2 text-center">
							{gameResult == GameResult.Winner	&& <InfoText className="text-green-500">{t("gamemodal.winner")}</InfoText>}
							{gameResult == GameResult.Loser		&& <InfoText className="text-red-500">{t("gamemodal.loser")}</InfoText>}
							{gameResult == GameResult.Draw		&& <InfoText className="text-yellow-500">{t("gamemodal.draw")}</InfoText>}
							{gameResult == GameResult.Paused	&& (
								<div className="flex items-center">
									<PauseIcon className="inline-block w-12 h-12"/>
									<InfoText>{t("gamemodal.pause")}</InfoText>
								</div>
							)}
							{ status === Status.Disconnected	&& ( <p style={{ color: 'grey' }}> {t("gamemodal.oppdisconnect")} </p> ) }
							{ status === Status.Unavailable		&& ( <p style={{ color: 'grey' }}> {t("gamemodal.oppdidntconnect")} </p> ) }
							{ status === Status.Left			&& ( <p style={{ color: 'grey' }}> {t("gamemodal.oppleft")} </p> ) }
						</div>
					</div>
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					{quit		&& <ModalButton onClick={quit} color={"danger"}>{t("gamemodal.quit")}</ModalButton>}
					{rematch	&& <ModalButton onClick={rematch} isDisabled={status !== undefined} isLoading={buttonLoading} >{t("gamemodal.rematch")}</ModalButton>}
					{nextGame	&& <LoadingButton isDisabled={disableButton} onClick={() => nextGame()}>{t("gamemodal.nextmatch")}</LoadingButton>}
					{queue		&& <LoadingButton isDisabled={disableButton} onClick={() => queue()}>{t("gamemodal.queue")}</LoadingButton>}
					{pauseInfo	&& (
						<ModalButton
							onClick={pauseInfo.onClick}
							isDisabled={pauseInfo.currentClients === pauseInfo.maxClients}
							isLoading={pauseInfo.currentClients === pauseInfo.maxClients}
							className={`${styles.buttonWithArrow} ${styles.gradientButton}`}
						>
							{pauseInfo.currentClients === 0 && (<>
								<span>{t("gamemodal.continue")}</span>
								<RightArrowIcon /> 
							</>)}
							{pauseInfo.currentClients !== 0 && (<>
								<span>
								 	{pauseInfo.currentClients === pauseInfo.maxClients ? t("gamemodal.starting") : t("gamemodal.waiting")}
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
						</ModalButton>
					)}
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default GameModal;
export { GameResult, Status };
