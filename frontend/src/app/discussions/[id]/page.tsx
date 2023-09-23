"use client";
import { DiscussionsList } from "@/app/components/dashboard";

interface Props {
	params: { id: string };
}
export default function DiscussionPublicPage({ params }: Props) {
	return (
		<main className="p-6">
			<DiscussionsList discussion_id={params.id} allowCreate />
		</main>
	);
}
