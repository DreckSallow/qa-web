"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { GoogleIcon } from "@/app/components/icons";

interface GoogleAuthProps {
	label?: string;
	type?: "sign in" | "sign up";
	btnClass?: string;
}

export function GoogleAuthButton(props: GoogleAuthProps) {
	const supabase = createClientComponentClient();
	const handleGoogleAuth = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: "/auth/callback",
			},
		});
	};
	return (
		<button
			onClick={handleGoogleAuth}
			type="button"
			className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2 justify-center ${props.btnClass ?? ""
				}`}
		>
			<GoogleIcon className="w-4 h-4 mr-2" />
			{props.label
				? props.label
				: props.type === "sign in"
					? "Sign in with Google"
					: "Register with Google"}
		</button>
	);
}
