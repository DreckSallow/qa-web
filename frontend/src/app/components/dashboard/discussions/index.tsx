"use client";
import { useEffect, useState, FormEvent } from "react";
import { AnimatePresence } from "framer-motion";
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/outline";
import { toast } from "sonner";
import { CommentInfo, DiscussionInfo } from "@/interfaces";
import { saveCommentsLikes } from "@/services";
import { useGetDiscussionState } from "@/hooks";
import { CardComment } from "./card_message";

interface DiscussionProps {
	allowCreate?: boolean;
	allowRemove?: boolean;
	discussion_id: string;
}

const MAX_MESSAGES = 20;

export const DiscussionsList = ({
	discussion_id,
	allowRemove,
	allowCreate,
}: DiscussionProps) => {
	const { data, setData, request } = useGetDiscussionState(discussion_id);
	const [ws, setWebSocket] = useState<WebSocket | null>();

	const isExceededLimit = (data?.comments.length || 0) >= MAX_MESSAGES;

	function setComments(fn: (cm: CommentInfo[]) => CommentInfo[]) {
		setData((d) => {
			if (!d) return null;
			return {
				discussion: d.discussion,
				comments: fn(d.comments).sort((a, b) => b.likes - a.likes),
			};
		});
	}

	useEffect(() => {
		if (!data) return;
		const socket = new WebSocket(`ws://localhost:3001/thread/${discussion_id}`);
		socket.addEventListener("message", function (m) {
			const parsed = JSON.parse(m.data);
			if (parsed.type === "Error") {
				return toast.error(parsed.payload);
			}
			parsed.payload = JSON.parse(parsed.payload)[0];
			const { type, payload } = parsed;
			if (type === "Create") {
				return setComments((cms) => cms.concat(payload));
			} else if (type === "Delete") {
				return setComments((comments) =>
					comments.filter(({ id }) => id !== payload.id),
				);
			} else if (type === "Update") {
				return setComments((comments) => {
					const newComments = comments.map((cm) =>
						cm.id === payload.id ? { ...payload, isLiked: !cm.isLiked } : cm,
					);
					saveCommentsLikes(
						discussion_id,
						newComments.filter(({ isLiked }) => isLiked).map(({ id }) => id),
					);
					return newComments;
				});
			}
		});
		socket.addEventListener("error", () => {
			toast.error("It was not possible to connect.");
		});
		socket.addEventListener("close", () => {
			toast.error("Connection closed, please try again later.");
		});
		setWebSocket(socket);
		return function () {
			// cleanup the data
			socket.close();
		};
	}, [request]);

	const handleCreateComment = (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		if ((data?.comments.length || 0) >= MAX_MESSAGES) {
			return toast.error(
				"The discussion exceeded the limit of allowed messages.",
			);
		}
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
			}, 500);
		}
	};
	const handleLikeComment = (id: string, likes: number) => {
		if (!ws) return;
		const msg = {
			type: "Update",
			payload: { id, likes },
		};
		ws.send(JSON.stringify(msg));
	};

	const handleRemoveComment = (id: string) => {
		if (!ws) return;
		const msg = {
			type: "Delete",
			payload: { id },
		};
		ws.send(JSON.stringify(msg));
	};
	return (
		<>
			{request.isLoading && (
				<p className="mt-6 text-slate-600 text-xl font-medium">Loading...</p>
			)}
			{!request.isLoading && data && (
				<>
					<Header
						discussion={data.discussion}
						commentsLength={data.comments.length}
					/>
					<section className="">
						<AnimatePresence>
							{data.comments.map((cm) => {
								return (
									<CardComment
										canRemove={allowRemove}
										comment={cm}
										key={cm.id}
										onRemove={handleRemoveComment}
										onLike={handleLikeComment}
									/>
								);
							})}{" "}
						</AnimatePresence>
					</section>{" "}
				</>
			)}
			{allowCreate && (
				<section className="fixed bottom-2 p-4 w-[70%] mx-[15%] overflow-hidden">
					<form
						className="border-gray-200 border rounded-lg bg-gray-50 overflow-hidden"
						onSubmit={handleCreateComment}
					>
						<div className="px-4 py-2 bg-white">
							<label className="sr-only">Your comment</label>
							<textarea
								disabled={isExceededLimit}
								id="comment"
								className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-2 py-3 px-2 ring:purple-400"
								placeholder="Write a comment..."
								required
							/>
						</div>
						<div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
							<button
								disabled={isExceededLimit}
								type="submit"
								className={`inline-flex button items-center py-2 text-xs font-medium text-center text-white bg-purple-600 focus:ring-4 focus:ring-blue-200 ${
									isExceededLimit ? "opacity-60" : "opacity-100"
								}`}
							>
								Post comment
							</button>
							{isExceededLimit && (
								<p className="text-sm text-red-700/70 font-semibold">
									Message limit reached.
								</p>
							)}
						</div>
					</form>
				</section>
			)}
		</>
	);
};
interface HeaderProps {
	discussion: DiscussionInfo;
	commentsLength: number;
}

const Header = ({ discussion, commentsLength }: HeaderProps) => {
	return (
		<header className="flex flex-col border-b-2 border-gray-200 gap-2 pb-4 sm:flex-row sm:gap-8">
			<div className="">
				<h1 className="text-4xl font-semibold text-slate-800">
					{discussion?.title}
				</h1>
				<p className="mt-4 text-slate-600">{discussion?.description}</p>
			</div>
			<div className="flex items-end">
				<span
					className={`rounded-full py-1 px-2 text-xs h-max text-slate-700 flex flex-row items-center gap-2 border-2 ${
						commentsLength >= MAX_MESSAGES
							? "border-red-300 bg-red-200/40"
							: "border-green-300 bg-green-200/40"
					}`}
				>
					{commentsLength >= MAX_MESSAGES ? (
						<ExclamationIcon className="w-5 h-5 stroke-slate-600" />
					) : (
						<CheckCircleIcon className="w-5 h-5 stroke-slate-600" />
					)}
					Comments: {commentsLength}
				</span>
			</div>
		</header>
	);
};
