import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const supabase = createServerComponentClient({ cookies });
	const { data: { session } } = await supabase.auth.getSession()
	if (!session) {
		redirect("/login");
	}

	return (
		<main className="min-h-screen">
			<h1>DASHBAORD PAGE</h1>
		</main>
	);
}
