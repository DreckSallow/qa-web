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

export const getCommentsLikes = () => {
	const ids = localStorage.getItem("comments");
	if (ids) return JSON.parse(ids) as string[];
	return [];
};

export const saveCommentsLikes = (ids: string[]) => {
	localStorage.setItem("comments", JSON.stringify(ids));
};
