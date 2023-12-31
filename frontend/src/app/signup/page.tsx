import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { GoogleAuthButton } from "../components/forms/buttons";
import { RegisterForm } from "./components";

export const dynamic = "force-dynamic";
export default async function RegisterPage() {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (session !== null) {
		redirect("/dashboard/overview");
	}
	return (
		<main className="w-full">
			<header className="fixed flex items-center justify-start px-4 h-[70px]">
				<a href="/">
					<Image src="/logo-text.svg" width={150} height={60} alt="logo" />
				</a>
			</header>
			<section className="h-screen flex flex-col justify-center items-center pt-[70px]">
				<h1 className="px-4 text-2xl text-center text-gray-700">
					Create an account
				</h1>
				<div className="p-4">
					<div className="w-full">
						<GoogleAuthButton
							type="sign up"
							btnClass="bg-purple-500 w-full ring-purple-300 py-3"
						/>
					</div>
					<div className="flex items-center">
						<hr className="flex-1 bg-gray-300 h-[1px]" />
						<span className="font-bold mx-3">or</span>
						<hr className="flex-1 bg-gray-300 h-[1px]" />
					</div>
					<RegisterForm />
				</div>
			</section>
		</main>
	);
}
