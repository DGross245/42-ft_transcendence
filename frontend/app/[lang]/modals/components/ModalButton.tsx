import { Button } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface ModalButtonProps {
	onClick?: () => void,
	children?: React.ReactNode | string,
	isDisabled?: boolean,
	isLoading?: boolean,
	className?: string,
	color?: any
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const ModalButton: React.FC<ModalButtonProps> = ({ onClick, children, isDisabled, isLoading, color, className }) => {
	return (
		<Button
			size="md"
			radius="lg"
			color={color ? color : "primary"}
			variant="shadow"
			onClick={onClick}
			className={`text-md ${className ? className : ""}`}
			isLoading={isLoading}
			isDisabled={isDisabled}
		>
			{children}
		</Button>
	)
}

export default ModalButton;
