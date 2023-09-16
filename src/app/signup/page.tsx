import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { GoogleAuthButton } from "../components/forms/buttons";
import { RegisterForm } from "./components";

export default async function RegisterPage() {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (session !== null) {
		redirect("/dashboard");
	}
	return (
		<main className="w-full h-screen flex justify-center items-center">
			<section>
				<h1 className="px-4 font-semibold text-xl text-purple-600">ASK</h1>
				<div className="p-4">
					<div className="w-full">
						<GoogleAuthButton
							type="sign up"
							btnClass="bg-purple-500 w-full ring-purple-300"
						/>
					</div>
					<div className="flex items-center">
						<hr className="flex-1 bg-gray-300 h-0.5" />
						<span className="font-bold mx-3">or</span>
						<hr className="flex-1 bg-gray-300 h-0.5" />
					</div>
					<RegisterForm />
				</div>
			</section>
		</main>
	);
}
