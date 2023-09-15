"use client";

import { HTMLInputTypeAttribute } from "react";

interface InputProps {
	label: string;
	placeholder: string;
	type: HTMLInputTypeAttribute;
	id: string;
}

export const InputForm = (props: InputProps) => {
	return (
		<div className="mb-4">
			<label
				className="block text-gray-700 text-sm font-bold mb-2"
				htmlFor={props.id}
			>
				{props.label}
			</label>
			<input
				placeholder={props.placeholder}
				id={props.id}
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type={props.type ?? "text"}
				required
			/>
		</div>
	);
};
