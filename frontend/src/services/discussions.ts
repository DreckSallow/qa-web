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
