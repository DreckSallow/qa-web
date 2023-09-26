"use client";
import { useEffect, useState } from "react";
import { Card, Title, DonutChart, Metric } from "@tremor/react";
import { type PostgrestError } from "@supabase/supabase-js";
import { useSupabase } from "../context";

interface InfoList {
	name: string;
	value: number;
}

interface WithAnalitycs {
	analytics: InfoList[];
}

interface DiscussionInfo extends WithAnalitycs {
	total: number;
	missing: number;
}

interface CommentsInfo extends WithAnalitycs {
	total: number;
}

export default function OverviewPage() {
	const { session, supabase } = useSupabase();
	const [requestState, setRequestState] = useState<{
		error: PostgrestError | null;
		isLoading: boolean;
	}>({ error: null, isLoading: true });
	const [data, setData] = useState<{
		discussion: DiscussionInfo;
		comments: CommentsInfo;
	} | null>();

	useEffect(() => {
		supabase
			.from("discussions")
			.select("id,title,description, comments (id,likes)")
			.then(({ data, error }) => {
				if (error) {
					return setRequestState({
						error,
						isLoading: false,
					});
				}
				const discussionData: DiscussionInfo = {
					total: data.length,
					missing: 5 - data.length,
					analytics: data.map(({ comments, title }) => ({
						name: title,
						value: comments.length,
					})),
				};

				const commentByDis = data.map(({ comments, title }) => ({
					name: title,
					value: comments.reduce((acc, { likes }) => acc + likes, 0),
				}));

				const commentsData: CommentsInfo = {
					total: commentByDis.reduce((acc, { value }) => acc + value, 0),
					analytics: commentByDis,
				};
				setData({
					discussion: discussionData,
					comments: commentsData,
				});
				setRequestState((s) => ({ ...s, isLoading: false }));
			});
	}, []);

	return (
		<main className="w-full h-screen overflow-y-scroll p-4">
			<header className="w-full border-b-2 border-gray-300 pb-6">
				<h1 className="text-2xl font-semibold text-slate-700">Overview</h1>
				<h3 className="text-slate-600 mt-3 font-normal">
					Hello {session.user.user_metadata["full_name"]} welcome back!
				</h3>
			</header>
			<section className="my-6 mx-8">
				<h2 className="text-2xl font-semibold mb-4 text-slate-700">
					Discussions
				</h2>
				{requestState.isLoading && (
					<p className="mt-8 text-xl text-slate-800">Loading...</p>
				)}
				{data && (
					<InfoData discussions={data?.discussion} comments={data?.comments} />
				)}
			</section>
		</main>
	);
}

interface InfoDataProps {
	discussions: DiscussionInfo;
	comments: CommentsInfo;
}

const InfoData = ({ discussions, comments }: InfoDataProps) => {
	return (
		<>
			<section className="flex flex-row gap-4 mb-4 items-center h-[300px]">
				<div className="h-full flex flex-col gap-4 w-[300px] max-w-[300px]">
					<CardInfo
						title="Total"
						content={discussions.total ?? 0}
						className="flex-1"
					/>
					<CardInfo
						title="Missing"
						content={discussions.missing ?? 0}
						className="flex-1"
					/>
				</div>
				<Card className="h-full flex flex-col flex-1">
					<Title className="">Comments by discussion</Title>
					<DonutChart
						className="flex-1 flex justify-center items-center"
						data={discussions.analytics ?? []}
						index={"name"}
						category="value"
						colors={getRandomColors(2)}
					/>
				</Card>
			</section>
			<h2 className="text-xl font-semibold text-slate-700 mt-8">Comments</h2>
			<section className="mt-4 flex flex-row gap-4 h-[300px]">
				<CardInfo
					title="Total"
					content={comments.total ?? 0}
					className="w-[250px]"
				/>
				<Card className="h-full flex flex-col">
					<Title>Likes by discussion</Title>
					<DonutChart
						className="flex-1 flex justify-center items-center"
						data={comments.analytics ?? []}
						index="name"
						category="value"
						colors={getRandomColors(2)}
					/>
				</Card>
			</section>{" "}
		</>
	);
};

interface CardProps {
	title: string;
	content: number | string;
	className?: string;
}

const CardInfo = ({ title, content, className }: CardProps) => {
	return (
		<Card className={`flex flex-col ${className ?? ""}`}>
			<Title className="text-sm text-slate-600 mb-2">{title}</Title>
			<Metric className="text-5xl text-slate-700 justify-center flex flex-1 items-center">
				{content}
			</Metric>
		</Card>
	);
};

function getRandomColors(n: number): string[] {
	const colors = [
		"slate",
		"gray",
		"zinc",
		"neutral",
		"stone",
		"red",
		"orange",
		"amber",
		"yellow",
		"lime",
		"green",
		"emerald",
		"teal",
		"cyan",
		"sky",
		"blue",
		"indigo",
		"violet",
		"purple",
		"fuchsia",
		"pink",
		"rose",
	];

	const returnColors: string[] = [];

	while (returnColors.length <= n) {
		const index = Math.floor(Math.random() * colors.length);
		const selected = colors.at(index);
		if (selected && returnColors.at(returnColors.length - 1) != selected) {
			returnColors.push(selected);
		}
	}

	return returnColors;
}
