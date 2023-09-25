import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";
import { SupabaseProvider } from "./context";

export const dynamic = "force-dynamic";

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
		<main className="min-h-screen w-full flex flex-row divide-x-2 divide-slate-300">
			<Sidebar />
			<section className="flex-1 max-h-screen overflow-scroll">
				<SupabaseProvider session={session}>{children}</SupabaseProvider>
			</section>
		</main>
	);
}
