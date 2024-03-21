import { useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                                  onUnmount                                 */
/* -------------------------------------------------------------------------- */
const useOnUnUnmount = (callback: () => void) => {
	const [currentPath, setCurrentPath] = useState<undefined | string>(undefined);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setCurrentPath(window.location.pathname);
		}
	}, []);
	useEffect(() => {
		return () => {
			if (currentPath !== undefined && typeof window !== "undefined" && currentPath !== window.location.pathname) {
				callback();
			}
		}
	}, [currentPath, callback]);
}
export default useOnUnUnmount;
