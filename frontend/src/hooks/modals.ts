import { useRef } from "react";

export const useModal = () => {
	const modalRef = useRef<HTMLDialogElement>(null);

	function closeModal() {
		if (modalRef) modalRef.current?.close();
	}
	function openModal() {
		if (modalRef) modalRef.current?.showModal();
	}

	return {
		ref: modalRef,
		closeModal,
		openModal,
	};
};
