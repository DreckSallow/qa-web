"use client";

import { HTMLInputTypeAttribute } from "react";

interface InputProps {
	label: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	id: string;
	errorMessage?: string;
	onInput?: (ev: React.FormEvent<HTMLInputElement>) => void;
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
				onInput={props.onInput}
				placeholder={props.placeholder}
				id={props.id}
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				type={props.type ?? "text"}
			/>
			<p className="text-red-500 text-xs italic">{props.errorMessage}</p>
		</div>
	);
};
