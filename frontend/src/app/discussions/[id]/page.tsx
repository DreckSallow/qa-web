"use client";
import Image from "next/image";
import { DiscussionsList } from "@/app/components/dashboard";

interface Props {
	params: { id: string };
}
export default function DiscussionPublicPage({ params }: Props) {
	return (
		<main className="p-6">
			<header className="mb-8">
				<a href="/">
					<Image src="/logo-text.svg" width={120} height={40} alt="logo" />
				</a>{" "}
			</header>
			<DiscussionsList discussion_id={params.id} allowCreate />
		</main>
	);
}
