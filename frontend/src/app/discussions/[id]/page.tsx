"use client";

import { CommentInfo, DiscussionInfo } from "@/interfaces";
import { getDiscussions } from "@/services";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, Text } from "@tremor/react";
import { FormEvent, useEffect, useState } from "react";

interface Props {
	params: { id: string };
}

export default function DiscussionPublicPage({ params }: Props) {
	const [discussion, setDiscussion] = useState<Omit<
		DiscussionInfo,
		"id"
	> | null>(null);
	const [ws, setWebSocket] = useState<WebSocket | null>(null);
	const [comments, setComments] = useState<CommentInfo[]>([]);
	const supabase = createClientComponentClient();
	useEffect(() => {
		getDiscussions(supabase, params.id).then(({ data, error }) => {
			if (error) {
				return;
			}
			console.log({ data, error });
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
				const parsed = JSON.parse(m.data);
				parsed.payload = JSON.parse(parsed.payload)[0];
				const { type, payload } = parsed;
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
	const handleCreateComment = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		const target = ev.target as HTMLFormElement;
		const textarea = target.querySelector("#comment") as HTMLTextAreaElement;
		const value = textarea.value;
		if (value.length > 0 && ws) {
			ws.send(
				JSON.stringify({
					type: "Create",
					payload: {
						message: value,
					},
				}),
			);
			setTimeout(() => {
				textarea.value = "";
			}, 1000);
		}
	};
	return (
		<main className="p-4 h-screen">
			<header className="flex flex-row border-b-2 border-gray-200 gap-4">
				<div className="flex-1">
					<h1 className="text-4xl font-semibold text-slate-800">
						{discussion?.title}
					</h1>
					<p className="mt-4 text-slate-600 mb-8">{discussion?.description}</p>
				</div>
			</header>{" "}
			<section className="w-full px-8 py-4">
				{comments.map(({ id, message, likes }) => {
					return (
						<Card key={id} className="max-w-md mt-4 relative">
							<Text> {message}</Text>
							<span>{likes}</span>
						</Card>
					);
				})}{" "}
			</section>
			<section className="fixed bottom-2 p-4 w-[70%] mx-[15%]">
				<form
					className="border-gray-200 border rounded-lg bg-gray-50"
					onSubmit={handleCreateComment}
				>
					<div className="px-4 py-2 bg-white">
						<label className="sr-only">Your comment</label>
						<textarea
							id="comment"
							className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-2 py-3 px-2 ring:purple-400"
							placeholder="Write a comment..."
							required
						/>
					</div>
					<div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
						<button
							type="submit"
							className="inline-flex items-center py-2 px-3 text-xs font-medium text-center text-white bg-purple-600 rounded-lg focus:ring-4 focus:ring-blue-200"
						>
							Post comment
						</button>{" "}
					</div>
				</form>
			</section>
		</main>
	);
}
