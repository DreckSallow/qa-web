"use client";
import { DiscussionsList } from "@/app/components/dashboard";

interface Props {
	params: { id: string };
}
export default function DiscussionPage({ params }: Props) {
	return (
		<main className="p-6 h-screen overflow-y-scroll">
			<DiscussionsList discussion_id={params.id} allowRemove />
		</main>
	);
}
