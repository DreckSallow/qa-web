import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleAuthButton } from "../components/forms";
import { LoginForm } from "./components";
export const dynamic = "force-dynamic";
export default async function LoginPage() {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();
	if (session !== null) {
		redirect("/dashboard");
	}

	return (
		<main className="w-full">
			<header className="fixed flex items-center justify-start px-4 h-[70px]">
				<a href="/" className="text-xl text-purple-500 font-semibold">
					ASK
				</a>
			</header>
			<section className="h-screen flex flex-col justify-center items-center pt-[70px]">
				<h1 className="px-4 text-2xl text-center text-gray-700">Login</h1>
				<div className="p-4">
					<div>
						<GoogleAuthButton
							btnClass="bg-purple-500 ring-purple-300 text-center w-full py-3"
							type="sign in"
						/>
					</div>
					<div className="flex items-center">
						<hr className="flex-1 bg-gray-300 h-[1px]" />
						<span className="font-bold mx-3">or</span>
						<hr className="flex-1 bg-gray-300 h-[1px]" />
					</div>
					<LoginForm />
				</div>
			</section>
		</main>
	);
}
