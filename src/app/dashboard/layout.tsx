import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";

export default async function DashboardPage({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession();
	if (!session || error) {
		redirect("/login");
	}

	return (
		<main className="min-h-screen w-full grid grid-cols-12 divide-x-2 divide-slate-300">
			<Sidebar />
			<section className="col-start-3 col-end-13">{children}</section>
		</main>
	);
}
