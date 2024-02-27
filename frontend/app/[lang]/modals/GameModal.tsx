import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import styles from "./Modals.module.css";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */
enum GameResult {
	Winner,
	Looser,
	Draw,
	Paused
}
interface GameWinningModalProps {
	isOpen: boolean,
	gameResult?: GameResult,
	loading?: boolean,
	rematch?: () => void,
	nextGame?: () => void,
	finish?: () => void,
	resume?: () => void
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const GameModal: React.FC<GameWinningModalProps> = ({isOpen, gameResult, loading, rematch, nextGame, finish, resume}) => {
	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			placement="center"
			closeButton={<></>}
			onClose={gameResult == GameResult.Paused && resume ? resume : () => {}}
			isDismissable={gameResult == GameResult.Paused ? true : false}
			isKeyboardDismissDisabled={gameResult == GameResult.Paused ? false : true}
			>
			<ModalContent>
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg" />
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					{gameResult == GameResult.Winner	&& <h1 className={styles.emojiIcon}>🏆</h1>}
					{gameResult == GameResult.Looser	&& <h1 className={styles.emojiIcon}>😕</h1>}
					{gameResult == GameResult.Draw		&& <h1 className={styles.emojiIcon}>➖</h1>}
					{gameResult == GameResult.Paused	&& <h1 className={styles.emojiIcon}>🚀</h1>}
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					<div className="flex justify-center">
						{gameResult == GameResult.Winner	&& <h1 className="text-green-500 font-bold text-4xl">Winner</h1>}
						{gameResult == GameResult.Looser	&& <h1 className="text-red-500 font-bold text-4xl">Looser</h1>}
						{gameResult == GameResult.Draw		&& <h1 className="text-yellow-500 font-bold text-4xl">Draw</h1>}
						{gameResult == GameResult.Paused	&& <h1 className="font-bold text-4xl">Paused...</h1>}
					</div>
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					{rematch	&& <Button color="primary" onClick={rematch}>Rematch</Button>}
					{nextGame	&& <Button color="primary" onClick={nextGame}>Next Game</Button>}
					{finish		&& <Button color="primary" onClick={finish}>Finish</Button>}
					{resume		&& <Button color="primary" onClick={resume}>Resume Game</Button>}
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default GameModal;
export { GameResult };
