"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
	params: { id: string };
}

interface Discussion {
	title: string;
	description: string;
}

export default function DiscussionPage({ params }: Props) {
	const [discussion, setDiscussion] = useState<Discussion | null>(null);
	const router = useRouter();

	const supabase = createClientComponentClient();
	useEffect(() => {
		supabase
			.from("discussions")
			.select("title,description")
			.eq("id", params.id)
			.then(({ data, error }) => {
				if (error) {
					return router.replace("/dashboard/discussions");
				}
				setDiscussion(data[0]);
			});
	}, []);
	return (
		<main className="p-6">
			<header className="flex flex-row border-b-2 border-gray-200 gap-4">
				<button onClick={router.back}>{"<-"}</button>
				<div className="flex-1">
					<h1 className="text-4xl font-semibold text-slate-800">
						{discussion?.title}
					</h1>
					<p className="mt-4 text-slate-600 mb-8">{discussion?.description}</p>
				</div>
			</header>
		</main>
	);
}
