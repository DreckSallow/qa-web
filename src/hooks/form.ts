import { useState, useRef, FormEvent } from "react";

export interface FormFieldAttr {
	required?: boolean;
	requiredMessage?: string;
	checker?: (val: string | number) => string | undefined;
}

export interface UseFormArgs {
	[k: string]: FormFieldAttr;
}

export type InputFieldsStr = {
	[k: string]: string | undefined;
};
const initErrs = (fields: UseFormArgs) => {
	return Object.keys(fields).reduce(
		(s, k) => ({
			...s,
			[k]: fields[k].required
				? fields[k].requiredMessage || "This input is required"
				: undefined,
		}),
		{} as InputFieldsStr,
	);
};

export const useFormSubmit = <T extends UseFormArgs>(fields: T) => {
	const [errors, setErrors] = useState<InputFieldsStr>({});
	const internalErrors = useRef(initErrs(fields));
	const inputs = useRef<InputFieldsStr>(
		Object.keys(fields).reduce((ac, k) => ({ ...ac, [k]: "" }), {}),
	);

	function checkValue(key: string, val: string) {
		const fieldAttr = fields[key];
		inputs.current[key] = val;
		if (!val && fieldAttr.required) {
			internalErrors.current[key] =
				fieldAttr.requiredMessage ?? "This input is required.";
		} else if (fieldAttr.checker && val) {
			const errMsg = fieldAttr.checker(val);
			internalErrors.current[key] = errMsg;
		} else {
			internalErrors.current[key] = undefined;
		}
	}

	function handleInput(key: keyof UseFormArgs) {
		return (event: React.FormEvent<HTMLInputElement>) => {
			const val = (event.target as HTMLInputElement | null)?.value;
			checkValue(key as string, val as string);
		};
	}

	function handleSubmit(
		f: (inputs: InputFieldsStr, errs: InputFieldsStr) => void,
	) {
		return (ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			Object.entries(inputs.current).forEach(([k, v]) =>
				checkValue(k, v as string),
			);
			setErrors({ ...internalErrors.current });
			const hasErrors = Object.values(internalErrors.current).some((v) => !!v);
			if (!hasErrors) {
				f(inputs.current, internalErrors.current);
			}
		};
	}
	return {
		handleInput,
		handleSubmit,
		errors,
	};
};
