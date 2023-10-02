"use client";
import { useEffect, useState } from "react";
import { type PostgrestError } from "@supabase/supabase-js";
import { Card, Title, DonutChart, Metric, Color } from "@tremor/react";
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
			.select("id,title,description,user_id, comments (id,likes)")
			.eq("user_id", session.user.id)
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
			<section className="my-6 mx-2 lg:mx-8">
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
			<section className="flex flex-col gap-4 mb-4 items-center lg:flex-row lg:h-[300px]">
				<div className="h-full w-full flex flex-row gap-4 lg:flex-col lg:max-w-[400px]">
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
				<Card className="w-full lg:h-full">
					<Title className="">Comments by discussion</Title>
					<DonutChart
						className="flex flex-col justify-around"
						data={discussions.analytics ?? []}
						index={"name"}
						category="value"
						colors={getRandomColors(2)}
					/>
				</Card>
			</section>
			<h2 className="text-xl font-semibold text-slate-700 mt-8">Comments</h2>
			<section className="mt-4 flex flex-col gap-4 lg:flex-row lg:h-[300px]">
				<CardInfo
					title="Total"
					content={comments.total ?? 0}
					className="w-full lg:max-w-[400px] lg:h-full"
				/>
				<Card className="h-full flex flex-col min-h-[250px]">
					<Title>Likes by discussion</Title>
					<DonutChart
						className="flex flex-col justify-around"
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

function getRandomColors(n: number): Color[] {
	const colors = [
		"slate",
		"zinc",
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

	const returnColors: Color[] = [];

	while (returnColors.length <= n) {
		const index = Math.floor(Math.random() * colors.length);
		const selected = colors.at(index);
		if (selected && returnColors.at(returnColors.length - 1) != selected) {
			returnColors.push(selected as Color);
		}
	}

	return returnColors;
}
