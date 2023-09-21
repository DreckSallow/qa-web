export interface DiscussionInfo {
	id: string;
	title: string;
	description: string;
}

export interface CommentInfo {
	message: string;
	id: string;
	likes: number;
}

export interface DiscussionComplete extends DiscussionInfo {
	comments: CommentInfo[];
}