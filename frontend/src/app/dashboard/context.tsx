"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export const SupabaseContext = createContext<Context>({} as Context);

interface Context {
	session: Session;
	supabase: SupabaseClient;
}

interface Props {
	children: React.ReactNode;
	session: Session;
}

export function SupabaseProvider({ children, session }: Props) {
	const supabase = createClientComponentClient();
	return (
		<SupabaseContext.Provider value={{ session, supabase }}>
			{children}
		</SupabaseContext.Provider>
	);
}

export const useSupabase = () => {
	return useContext(SupabaseContext);
};
