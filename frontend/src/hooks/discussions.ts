import { CommentInfo, DiscussionInfo } from "@/interfaces";
import { getCommentsLikes, getDiscussions } from "@/services";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

interface Data {
	discussion: DiscussionInfo;
	comments: CommentInfo[];
}

interface RequestInfo {
	error: PostgrestError | null | { message: string };
	isLoading: boolean;
}

export const useGetDiscussionState = (disId: DiscussionInfo["id"]) => {
	const [request, setRequest] = useState<RequestInfo>({
		error: null,
		isLoading: true,
	});
	const [discussionState, setDiscussionState] = useState<Data | null>(null);
	const supabase = createClientComponentClient();

	useEffect(() => {
		getDiscussions(supabase, disId).then(({ data, error }) => {
			if (error) {
				return setRequest((s) => ({ ...s, error }));
			}
			if (data.length == 0) {
				return setRequest({
					error: { message: "Discussion not found" },
					isLoading: false,
				});
			}
			const first = data[0];
			const ids = getCommentsLikes(disId);
			setDiscussionState({
				discussion: {
					id: disId,
					description: first.description,
					title: first.title,
				},
				comments: first.comments
					.map(({ id, likes, message }) => ({
						id,
						likes,
						message,
						isLiked: ids.includes(id),
					}))
					.sort((a, b) => b.likes - a.likes),
			});
			setRequest({ error: null, isLoading: false });
		});
	}, []);

	return {
		request,
		setData: setDiscussionState,
		data: discussionState,
	};
};

export const useSocketDiscussion = () => {};
