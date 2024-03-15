import { Button } from "@nextui-org/react";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  Interface                                 */
/* -------------------------------------------------------------------------- */
interface LoadingButtonProps {
	onClick: (...args: any[]) => Promise<void>;
	children?: React.ReactNode | string,
	isDisabled?: boolean,
	className?: string,
	color?: any
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const LoadingButton: React.FC<LoadingButtonProps> = ({ onClick, children, isDisabled, color, className }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleOnClick = async () => {
		setIsLoading(true);
		await onClick();
		setIsLoading(false);
	}

	return (
		<Button
			size="md"
			radius="lg"
			color={color ? color : "primary"}
			variant="shadow"
			onClick={handleOnClick}
			className={`text-md ${className ? className : ""}`}
			isLoading={isLoading}
			isDisabled={isDisabled}
		>
			{children}
		</Button>
	)
}

export default LoadingButton;
