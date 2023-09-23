import { DiscussionInfo } from "@/interfaces";
import { SupabaseClient } from "@supabase/supabase-js";
export const getDiscussions = (
	supabase: SupabaseClient,
	id: DiscussionInfo["id"],
) => {
	return supabase
		.from("discussions")
		.select("title,description,comments(id,likes,message)")
		.eq("id", id);
};

export const getCommentsLikes = (disId: string) => {
	const ids = localStorage.getItem("comments");
	if (ids) return JSON.parse(ids)[disId] as string[];
	return [];
};

export const saveCommentsLikes = (disId: string, ids: string[]) => {
	const discussions = localStorage.getItem("comments");
	if (discussions) {
		const parsed = JSON.parse(discussions);
		parsed[disId] = ids;
		localStorage.setItem("comments", JSON.stringify(parsed));
	} else {
		localStorage.setItem("comments", JSON.stringify({ [disId]: ids }));
	}
};
