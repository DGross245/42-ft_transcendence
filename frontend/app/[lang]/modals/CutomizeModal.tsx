import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import styles from "./Modals.module.css";
import ModalButton from "./ModalButton";
import { useEffect, useState } from "react";
import clsx from "clsx";
import useContract from "@/components/hooks/useContract";

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

	useEffect(() => {
		if (inputColor) {
			setColor(inputColor);
		}
	}, [inputColor, setColor]);

	const onButtonClick = () => {
		startGame(username, color);
	}

	return (
		<Modal
			size="xl"
			isOpen={isOpen}
			backdrop="blur"
			placement="center"
			hideCloseButton={true}
			isDismissable={false}
			isKeyboardDismissDisabled={true}
		>
			<ModalContent>
				{loading && <div className=" absolute flex justify-center items-center h-full w-full">
					<Spinner size="lg"/>
				</div>}
				<ModalHeader className={clsx({"opacity-0": loading})}>
					<h1 className={clsx(styles.textWiggle, "text-2xl")}>Customize Your Game</h1>
				</ModalHeader>
				<ModalBody className={clsx({"opacity-0": loading})}>
					<Input
						isRequired
						type="username"
						value={username}
						label="Username"
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
							<h1>Select Color: </h1>
							<input
								type="color"
								value={color}
								id="hs-color-input"
								title="Choose your color"
								className={styles.colorSelector}
								onChange={(e) => setColor(e.target.value)}
								style={{backgroundColor: color, borderColor: color}}
							/>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className={clsx("flex justify-center", {"opacity-0": loading})}>
					<ModalButton onClick={onButtonClick}>
						{"Join Game"}
					</ModalButton>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default CustomizeModal;
