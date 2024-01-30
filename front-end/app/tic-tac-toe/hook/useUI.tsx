import { useSound } from "@/components/Sound";
import { useState } from "react";

export const useUI = () => {
	const [showModal, setShowModal] = useState(false);
	const soundEngine = useSound();

	const closeModal = () => {
		setShowModal(false);
	}

	const openModal = () => {
		soundEngine?.playSound("win");
		//losing1();
		//losing2();
		setShowModal(true);
	}

	return {
		closeModal,
		openModal,
		showModal,
		setShowModal
	}
}