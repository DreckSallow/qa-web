import { useState, useRef, FormEvent } from "react";

export interface FormFieldAttr {
	required?: boolean;
	value?: string;
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
/**
 ** Use this hook when you want only track the inputs, not change its.
 **/
export const useFormSubmit = <T extends UseFormArgs>(fields: T) => {
	const [errors, setErrors] = useState<InputFieldsStr>({});
	const internalErrors = useRef(initErrs(fields));
	const inputs = useRef<InputFieldsStr>(
		Object.keys(fields).reduce((ac, k) => ({ ...ac, [k]: "" }), {}),
	);

	function restoreForm() {
		setErrors({});
		internalErrors.current = initErrs(fields);
		inputs.current = Object.keys(fields).reduce(
			(ac, k) => ({ ...ac, [k]: "" }),
			{},
		);
	}

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
		return (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
		restoreForm,
		errors,
	};
};

export type Editable = HTMLInputElement | HTMLTextAreaElement;
export type FormEventInput = FormEvent<Editable>;

/**
 * Use this hook when you want sync the input states with
 * an external event or data
 */
export const useSyncForm = <T extends UseFormArgs>(fields: T) => {
	const [errors, setErrors] = useState<Record<string, string | undefined>>({});
	const [values, setValues] = useState(
		Object.entries(fields).reduce(
			(acc, [k, v]) => ({ ...acc, [k]: v.value ?? "" }),
			{} as Record<keyof T, string>,
		),
	);

	function checkValue<K extends keyof T>(
		key: K,
		val: string,
	): Record<keyof T, string | undefined> {
		const fieldAttr = fields[key];
		const copyErrors = { ...errors } as Record<keyof T, string | undefined>;
		if (!val && fieldAttr.required) {
			copyErrors[key] = fieldAttr.requiredMessage ?? "This input is required.";
		} else if (fieldAttr.checker && val) {
			const errMsg = fieldAttr.checker(val);
			copyErrors[key] = errMsg;
		} else {
			copyErrors[key] = undefined;
		}
		return copyErrors;
	}
	function value<K extends keyof T>(key: K): string {
		return values[key];
	}

	function handleInput<K extends keyof T>(key: K) {
		return (ev: FormEventInput) => {
			const val = (ev.target as Editable).value;
			const copyErrors = checkValue(key, val);
			setErrors(copyErrors);
			setValues((acc) => ({ ...acc, [key]: val }));
		};
	}

	function handleSubmit(fn: (values: Record<keyof T, string>) => void) {
		return (ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			let newErrors = {};
			Object.entries(values).forEach(([k, v]) => {
				newErrors = { ...newErrors, ...checkValue(k, v) };
			});
			if (!Object.values(newErrors).some((s) => s)) {
				fn(values);
			} else {
				setErrors(newErrors);
			}
		};
	}

	return {
		errors,
		value,
		handleInput,
		handleSubmit,
		setValues,
	};
};
