"use client";
import { XIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { CommentInfo } from "@/interfaces";

interface CardProps {
	comment: CommentInfo;
	canRemove?: boolean;
	onRemove?: (id: CommentInfo["id"]) => void;
	onLike: (id: CommentInfo["id"], likes: number) => void;
}

export const CardComment = ({
	comment,
	onRemove,
	canRemove,
	onLike,
}: CardProps) => {
	return (
		<div className="card max-w-md mt-4 relative">
			{canRemove && (
				<button
					className="rounded-full absolute top-[-6px] right-[-6px] bg-red-400 p-[3px] flex justify-center items-center"
					onClick={() => onRemove && onRemove(comment.id)}
				>
					<XIcon className="stroke-white h-4 w-4 stroke-[3]" />
				</button>
			)}

			<p className="mb-4">{comment.message}</p>
			<button
				className="flex flex-row items-center justify-center gap-2"
				onClick={() =>
					onLike(
						comment.id,
						comment.isLiked ? comment.likes - 1 : comment.likes + 1,
					)
				}
			>
				<ThumbUpIcon
					className={`w-5 w-5 ${
						comment.isLiked ? "stroke-blue-500" : "stroke-gray-500"
					}`}
				/>
				<span className="text-gray-500"> {comment.likes} </span>
			</button>
		</div>
	);
};
