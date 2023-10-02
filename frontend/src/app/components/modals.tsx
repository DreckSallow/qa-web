import { XIcon } from "@heroicons/react/outline";
import { ReactNode, MouseEvent, forwardRef } from "react";

interface DialogProps {
	className?: string;
	children: ReactNode;
	onClose: () => void;
}

export const ModalDialog = forwardRef<HTMLDialogElement, DialogProps>(
	({ className, children, onClose }, ref) => {
		const handleModalClick = (ev: MouseEvent<HTMLDialogElement>) => {
			const target = ev.target as HTMLElement;
			if (target.tagName === "DIALOG") {
				onClose();
			}
		};
		return (
			<dialog
				ref={ref}
				className={`relative rounded-lg ${className}`}
				onClick={handleModalClick}
			>
				<button
					onClick={onClose}
					className="p-1 rounded-md bg-gray-200 m-2 absolute top-0 right-0 cursor-pointer z-10"
				>
					<XIcon className="h-4 w-4" />
				</button>{" "}
				<div className="w-full h-full rounded-md relative p-6">{children}</div>
			</dialog>
		);
	},
);
