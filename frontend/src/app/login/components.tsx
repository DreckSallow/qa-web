"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { InputFieldsStr, UseFormArgs, useFormSubmit } from "@/hooks/";
import { InputForm } from "@/app/components/forms";
import { useState } from "react";
import { useRouter } from "next/navigation";
const formConfig: UseFormArgs = {
	password: {
		required: true,
		checker(val) {
			const pass = val as string;
			if (pass.length == 0) {
				return "Please choose a password.";
			} else if (pass.length < 6) {
				return "Provide a password with 6 length.";
			}
		},
	},
	email: {
		required: true,
		requiredMessage: "EMAIL REQUIRED",
		checker(val) {
			const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
			if (!emailRegex.test(val as string)) {
				return "Provide a correct email.";
			}
		},
	},
};
export const LoginForm = () => {
	const [formErr, setFormErr] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClientComponentClient();
	const { errors, handleInput, handleSubmit } = useFormSubmit(formConfig);

	const onSubmit = async (values: InputFieldsStr) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: values["email"] as string,
			password: values["password"] as string,
		});
		if (error) {
			setTimeout(() => setFormErr(null), 3000);
			return setFormErr(error.message);
		}
		router.refresh();
	};

	return (
		<form
			className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<InputForm
				id="log-email"
				label="Email"
				placeholder="Enter your email"
				onInput={handleInput("email")}
				errorMessage={errors["email"]}
			/>
			<InputForm
				id="log-password"
				label="Password"
				type="password"
				placeholder="Enter your password"
				onInput={handleInput("password")}
				errorMessage={errors["password"]}
			/>
			<button
				className="bg-purple-500  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-2 ring-purple-300 focus:ring-4"
				type="submit"
			>
				Sign In
			</button>
			{formErr && (
				<p className="mt-6 text-red-400 font-semibold text-center">{formErr}</p>
			)}
		</form>
	);
};
