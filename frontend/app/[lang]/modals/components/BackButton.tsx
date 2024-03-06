import { ArrowLeftIcon } from "@heroicons/react/24/solid";

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */
const BackButton: React.FC<{onClick?: () => void}> = ({ onClick }) => {
	return (
		<button type="button" onClick={onClick}
			className="absolute appearance-none select-none top-1 left-1 p-2 text-foreground-500 rounded-full hover:bg-default-100 active:bg-default-200 tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2"
		>
			<ArrowLeftIcon className="w-6 h-6"/>
		</button>
	)
}
export default BackButton;
