import { Metadata } from "next";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";
import { SupabaseProvider } from "./context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Quipp | Dashboard",
};

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
		<main className="min-h-screen w-full flex flex-col lg:flex-row">
			<Sidebar />
			<section className="flex-1 max-h-screen overflow-hidden border-slate-300 border-t-2 border-l-0 lg:border-l-2 lg:border-t-0">
				<SupabaseProvider session={session}>{children}</SupabaseProvider>
			</section>
		</main>
	);
}
