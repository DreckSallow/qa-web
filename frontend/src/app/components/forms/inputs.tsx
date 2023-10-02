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
				className={`shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-4 ring-blue-300 ${
					props.errorMessage ? "mb-2 border-red-500" : ""
				}`}
				type={props.type ?? "text"}
			/>
			<p className="text-red-500 text-xs italic">{props.errorMessage}</p>
		</div>
	);
};
