"use client";
import { InputFieldsStr, UseFormArgs, useFormSubmit } from "@/hooks/";
import { InputForm } from "../components/forms";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
const formConfig: UseFormArgs = {
	username: {
		required: true,
	},
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
		requiredMessage: "The email is required.",
		checker(val) {
			const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
			if (!emailRegex.test(val as string)) {
				return "Provide a correct email.";
			}
		},
	},
};
export const RegisterForm = () => {
	const [formErr, setFormErr] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClientComponentClient();
	const { errors, handleInput, handleSubmit } = useFormSubmit(formConfig);
	const onSubmit = async (values: InputFieldsStr) => {
		const { error } = await supabase.auth.signUp({
			email: values["email"] as string,
			password: values["password"] as string,
			options: {
				emailRedirectTo: "http://localhost:3000/auth/callback",
				data: {
					full_name: values["username"],
				},
			},
		});
		if (error) {
			return setFormErr(error.message);
		}
		router.push("/verify-email");
	};

	return (
		<form
			className="shadow-md rounded px-8 pt-6 pb-8 mb-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<InputForm
				id="re-username"
				label="Username"
				placeholder="Enter your username"
				onInput={handleInput("username")}
				errorMessage={errors["username"]}
			/>
			<InputForm
				id="re-email"
				label="Email"
				placeholder="Enter your email"
				onInput={handleInput("email")}
				errorMessage={errors["email"]}
			/>
			<InputForm
				id="re-password"
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
				Sign up
			</button>
			{formErr && (
				<p className="mt-6 text-red-400 font-semibold text-center">{formErr}</p>
			)}{" "}
		</form>
	);
};
