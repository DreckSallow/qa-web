"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { XIcon } from "@heroicons/react/outline";
import { Card, Icon, Text } from "@tremor/react";
import { CommentInfo, DiscussionInfo } from "@/interfaces";
import { getDiscussions } from "@/services";

interface Props {
	params: { id: string };
}

interface WsMessage<T> {
	type: "Create" | "Delete" | "Update";
	payload: T;
}

export default function DiscussionPage({ params }: Props) {
	const [discussion, setDiscussion] = useState<Omit<
		DiscussionInfo,
		"id"
	> | null>(null);
	const [ws, setWebSocket] = useState<WebSocket | null>(null);
	const [comments, setComments] = useState<CommentInfo[]>([]);
	const router = useRouter();

	const supabase = createClientComponentClient();
	useEffect(() => {
		getDiscussions(supabase, params.id).then(({ data, error }) => {
			if (error) {
				return router.replace("/dashboard/discussions");
			}
			const first = data[0];
			setDiscussion({
				description: first.description,
				title: first.title,
			});
			setComments(
				first.comments.map(({ id, likes, message }) => ({
					id,
					likes,
					message,
				})),
			);
			const socket = new WebSocket(`ws://localhost:3001/thread/${params.id}`);

			socket.addEventListener("message", (m) => {
				const parsed = JSON.parse(m.data) as WsMessage<any>;
				parsed.payload = JSON.parse(parsed.payload)[0];
				const { type, payload } = parsed;
				console.log({ type, payload });
				switch (type) {
					case "Create": {
						return setComments((cms) => cms.concat([payload]));
					}
					case "Delete": {
						return setComments((comments) =>
							comments.filter(({ id }) => id !== payload.id),
						);
					}
					case "Update": {
						return setComments((comments) =>
							comments.map((cm) => (cm.id === payload.id ? payload : cm)),
						);
					}
				}
			});
			socket.addEventListener("error", (e) => {
				console.log("SOCKET ERROR: ", e);
			});
			socket.addEventListener("close", (c) => {
				console.log("SOCKET CLOSED: ", c);
			});
			setWebSocket(socket);
		});
	}, []);
	const onRemoveComment = (id: string) => {
		if (!ws) return;
		const msg: WsMessage<any> = {
			type: "Delete",
			payload: { id },
		};
		ws.send(JSON.stringify(msg));
	};
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
			<section className="mt-4">
				{comments.map(({ id, message, likes }) => {
					return (
						<Card key={id} className="max-w-md mt-4 relative">
							<button
								className="rounded-full absolute top-[-6px] right-[-6px] bg-red-400"
								onClick={() => onRemoveComment(id)}
							>
								<Icon
									icon={XIcon}
									size="xs"
									tooltip="Remove comment"
									color="white"
								/>
							</button>
							<Text> {message}</Text>
							<span>{likes}</span>
						</Card>
					);
				})}
			</section>
		</main>
	);
}