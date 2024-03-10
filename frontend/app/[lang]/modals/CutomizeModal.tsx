import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import ModalButton from "./components/ModalButton";
import { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n";
import styles from "./Modals.module.css";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface CustomizeModalProps {
	color?: string,
	isOpen: boolean,
	loading?: boolean,
	username?: string,
	startGame: (username: string, color: string) => void
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const CustomizeModal: React.FC<CustomizeModalProps> = ({ color: inputColor, isOpen, loading, username: inputUsername, startGame }) => {
	const [username, setUsername] = useState(inputUsername || "");
	const [color, setColor] = useState(inputColor || "#2563eb");
	const { t } = useTranslation("modals");

	useEffect(() => {
		if (inputColor) {
			setColor(inputColor);
		} 
		if (inputUsername) {
			setUsername(inputUsername);
		}
	}, [inputColor, inputUsername]);

	const onButtonClick = () => {
		startGame(username, color);
	}

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
					<Spinner size="lg"/>
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					<h1 className={clsx(styles.textWiggle, "text-2xl")}>{t("customizemodal.header")}</h1>
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					<Input
						isRequired
						type="username"
						value={username}
						label={t("customizemodal.username")}
						variant="bordered"
						className="w-full"
						style={{color: color}}
						placeholder="HarryPotterObamaSonic10Inu"
						onChange={(e) => setUsername(e.target.value)}
						startContent={
							<div className="pointer-events-none flex items-center">
								<span className="text-default-400 text-small font-bold">@</span>
							</div>
					  	}
					/>
					<div className="flex justify-end items-center">
						<div className="flex items-center gap-4 font-bold">
							<h1>{t("customizemodal.selectcolor")}: </h1>
							<input
								type="color"
								value={color}
								id="hs-color-input"
								title={t("customizemodal.choosecolor")}
								className={styles.colorSelector}
								onChange={(e) => setColor(e.target.value)}
								style={{backgroundColor: color, borderColor: color}}
							/>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					<ModalButton onClick={onButtonClick}>
						{t("customizemodal.joingame")}
					</ModalButton>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default CustomizeModal;
