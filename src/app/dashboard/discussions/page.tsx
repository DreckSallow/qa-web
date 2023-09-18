"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, Title } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Discussion {
	id: string;
	title: string;
}

export default function DiscussionsPage() {
	const router = useRouter();
	const [discussions, setDiscussions] = useState<Discussion[]>([]);
	const supabase = createClientComponentClient();

	useEffect(() => {
		supabase
			.from("discussions")
			.select("id,title")
			.then((res) => {
				console.log(res);
				if (res.error) {
					return console.log("ERROR: ", res.error);
				}
				setDiscussions(
					res.data.map(({ id, title }) => ({
						id,
						title,
					})),
				);
			});
	}, []);

	return (
		<main className="p-6">
			<header className="border-b-2 border-gray-200">
				<h1 className="text-4xl font-semibold text-slate-800">Discussions</h1>
				<p className="mt-4 text-slate-600 mb-8">See your open discussions</p>
			</header>
			<DiscussSection
				discussions={discussions}
				onSelect={(id) => router.push(`/dashboard/discussions/${id}`)}
			/>
		</main>
	);
}

interface DiscussProps {
	onSelect: (d: Discussion["id"]) => void;
	discussions: Discussion[];
}

const DiscussSection = ({ onSelect, discussions }: DiscussProps) => {
	return (
		<section className="mt-[90px] flex flex-row gap-8 flex-wrap">
			{discussions.map((d, i) => {
				return (
					<Card
						className="max-w-xs hover:cursor-pointer hover:-translate-y-1 transform transition duration-900"
						key={i}
						onClick={() => {
							onSelect(d.id);
						}}
					>
						<Title>{d.title}</Title>
					</Card>
				);
			})}
		</section>
	);
};
