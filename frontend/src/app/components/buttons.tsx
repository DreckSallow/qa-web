"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const ToggleButtonAuth = () => {
	const [requestState, setRequestState] = useState<{ isLoading: boolean }>({
		isLoading: true,
	});
	const [isLogged, setIsLogged] = useState<boolean>(false);
	const supabase = createClientComponentClient();

	useEffect(() => {
		supabase.auth
			.getSession()
			.then(({ data, error }) => {
				if (error) throw new Error("Error getting session");
				if (!data.session) throw new Error("No session found.");
				setRequestState({ isLoading: false });
				setIsLogged(true);
			})
			.catch(() => {
				setRequestState({ isLoading: false });
			});
	}, []);

	if (requestState.isLoading) {
		return <></>;
	}

	if (isLogged) {
		return (
			<a
				href="/dashboard/overview"
				className="rounded-full bg-purple-500 text-white py-2 px-3 text-sm font-semibold"
			>
				Dashboard{" "}
			</a>
		);
	}

	return (
		<a
			href="/login"
			className="rounded-full bg-purple-500 text-white py-2 px-3 text-sm font-semibold"
		>
			Login
		</a>
	);
};
