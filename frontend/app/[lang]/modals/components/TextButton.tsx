import { Link } from "@nextui-org/react";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const TextButton: React.FC<{onClick?: () => void, children?: string}> = ({ onClick, children }) => {
	return (<Link className="cursor-pointer" onClick={onClick}>{children}</Link>)
}
export default TextButton;
