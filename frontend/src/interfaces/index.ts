import { PostgrestError } from "@supabase/supabase-js";

export interface DiscussionInfo {
	id: string;
	title: string;
	description: string;
}

export interface CommentInfo {
	message: string;
	id: string;
	likes: number;
	isLiked?: boolean;
}

export interface DiscussionComplete extends DiscussionInfo {
	comments: CommentInfo[];
}

export interface RequestState {
	error: PostgrestError | null;
	isLoading: boolean;
}
