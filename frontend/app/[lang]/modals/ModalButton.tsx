import { Button } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface ModalButtonProps {
	onClick?: () => void,
	children?: React.ReactNode | string,
	isDisabled?: boolean,
	isLoading?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const ModalButton: React.FC<ModalButtonProps> = ({ onClick, children, isDisabled, isLoading }) => {
	return (
		<Button
			size="md"
			radius="lg"
			color="primary"
			variant="shadow"
			onClick={onClick}
			className="text-md"
			isLoading={isLoading}
			isDisabled={isDisabled}
		>
			{children}
		</Button>
	)
}

export default ModalButton;
