import Image from "next/image";
import { ThumbUpIcon } from "@heroicons/react/outline";
import { GithubIcon } from "./components/icons";

export default function Landing() {
	return (
		<>
			<HeaderNav />
			<section className="w-full flex flex-col min-h-screen items-center justify-around px-8 pt-[80px] gap-16 xl:gap-4 xl:flex-row">
				<div className="mt-0 md:mt-[40px]">
					<h2 className="font-bold mb-10 text-center text-8xl text-6xl lg:text-7xl md:mb-6">
						Start Your <span className="text-purple-500">Q&A</span>
						<br /> Journey
					</h2>
					<div className="w-full flex justify-center gap-2 xl:justify-start">
						<a
							href="/signup"
							className="bg-purple-500 text-white font-semibold rounded-md py-3 px-7"
						>
							Start now
						</a>
						<a
							href="/discussions/id"
							className="border-2 border-solid border-purple-500 text-black font-semibold rounded-md py-3 px-7"
						>
							See a Demo
						</a>
					</div>
				</div>
				<PrincipalImg />
			</section>
			<section className="px-10 py-3 flex flex-col items-center justify-center">
				<h2 className="text-4xl font-semibold mb-3 mt-4">How it works</h2>
				<h4 className="mb-5 mb-14">
					Simplify the process of interacting with your community in 3 simple
					steps:
				</h4>
				<div className="grid grid-cols-1 gap-2 max-w-md md:max-w-5xl md:grid-cols-3 lg:gap-8">
					<SectionCard
						img="/signup.svg"
						title="Create an account"
						content="First you need to create and account, providing basic information or using google."
					/>
					<SectionCard
						img="/idea.svg"
						title="Open a topic"
						content="Once your account is ready, it's time to open a discussion or topic that resonates with your audience."
					/>
					<SectionCard
						img="/community.svg"
						title="Interact with your community"
						content="Now you have the power to observe comments and questions from your users in real-time."
					/>
				</div>
			</section>
			<section className="px-12 py-2 flex flex-col items-center justify-center my-20">
				<h2 className="text-slate-700 text-3xl font-semibold">
					Frequent questions
				</h2>
				<div className="mt-8 gap-3 grid grid-cols-1 max-w-md md:max-w-5xl md:grid-cols-3 lg:gap-6">
					<FaqCard title="Do you have pricing plans?">
						<p className="mt-2 text-sm text-slate-800">
							Currently, we do not have a pricing structure in place. Instead,
							our service operates with usage limits for users.
						</p>
					</FaqCard>
					<FaqCard title="Can I control who joins?">
						<p className="mt-2 text-sm text-slate-800">
							Currently, you cannot control who joins. Anyone can leave a
							comment and give likes.
						</p>
					</FaqCard>
					<FaqCard title="What are the limits?">
						<p className="mt-2 text-sm text-slate-800">
							You can have up to 3 open discussions, with a maximum of 30
							comments per discussion.
						</p>
					</FaqCard>
				</div>
			</section>
			<section className="py-28 flex flex-col justify-center items-center text-center bg-purple-500 text-white mt-12">
				<h2 className="font-bold text-6xl mb-10 md:text-7xl">
					Start to interact <br /> with your community
				</h2>
				<a
					href="/signup"
					className="py-3 px-5 rounded-md bg-black text-xl font-semibold hover:opacity-70"
				>
					Start now
				</a>
			</section>
			<footer className="w-full min-h-20 py-10 px-4  flex flex-col justify-center">
				<section className="flex flex-row justify-around">
					<a href="/" className="text-purple-600 font-semibold text-xl">
						Quipp
					</a>
					<a
						href="https://github.com/DreckSallow/qa-web"
						target="_blank"
						className="flex flex-row items-center font-semibold"
					>
						<GithubIcon className="h-8 w-8 fill-gray-700" />
						Author
					</a>
				</section>
				<span className="text-lg text-center mt-8 text-medium">
					Made by{" "}
					<a
						href="https://github.com/DreckSallow/qa-web"
						target="_blank"
						className="link text-purple-700 font-medium"
					>
						Dreck Sallow.
					</a>{" "}
					&copy; 2023. | All Rights Reserved.
				</span>
			</footer>
		</>
	);
}

const FaqCard = ({
	title,
	children,
}: { title: string; children: React.ReactNode }) => {
	return (
		<div className="card w-72 shadow-lg p-6 w-full">
			<h3 className="text-lg text-slate-700 mb-2 font-medium">{title}</h3>
			{children}
		</div>
	);
};

const SectionCard = ({
	img,
	title,
	content,
}: { img: string; title: string; content: string }) => {
	return (
		<div className="card border-gray-200 shadow-lg w-full">
			<div className="w-full flex">
				<Image
					src={img}
					width={240}
					height={200}
					alt="account"
					className="max-w-[240px] max-h-[200px] w-[240px] h-[200px] m-auto min-w-0"
				/>
			</div>
			<h3 className="text-lg font-semibold text-slate-700 mt-2">{title}</h3>
			<p className="text-sm text-slate-700 mt-4">{content}</p>
		</div>
	);
};

const HeaderNav = () => {
	return (
		<header className="fixed flex top-0 w-full h-[80px] justify-center px-4 z-10 backdrop-blur-sm">
			<nav className="flex flex-row justify-between items-center w-full">
				<div>Quipp</div>
				<a
					href="/login"
					className="rounded-full bg-purple-500 text-white py-2 px-3 text-sm font-semibold"
				>
					Login
				</a>
			</nav>
		</header>
	);
};

const PrincipalImg = () => {
	return (
		<div className="relative z-80 mx-[100px] hidden md:block">
			<div className="absolute left-0 translate-x-[-40%] mt-2 flex flex-col gap-10 lg:translate-x-[-60%]">
				<PhoneMessage
					isLiked
					delay="15s"
					text="Quipp is an amazing and useful website."
				/>
				<PhoneMessage
					delay="17s"
					text="Impressive! What kinds of websites can you create?"
				/>
			</div>
			<div className="absolute right-0 translate-x-[40%] mt-2 flex flex-col gap-10 lg:translate-x-[60%]">
				<PhoneMessage
					isLiked
					delay="12s"
					text="Why is Dreck Sallow a great developer? :)"
				/>
				<PhoneMessage
					delay="20s"
					text="Do you have a favorite programming language?"
				/>
			</div>
			<Image
				className="max-w-[400px] min-w-[250px]"
				src="/content-creator.svg"
				width="400"
				height="350"
				alt="main-image"
			/>
		</div>
	);
};

const PhoneMessage = ({
	isLiked,
	delay,
	text,
}: { isLiked?: boolean; delay: string; text: string }) => {
	return (
		<div
			className="card shadow-lg p-2 min-w-[150px] max-w-[200px] bg-white floate"
			style={{ animationDuration: delay }}
		>
			<p className="text-sm p-1">
				{text}
				<ThumbUpIcon
					className={`h-5 w-5 mt-2 cursor-pointer ${
						isLiked ? "stroke-blue-400" : "stroke-gray-400"
					}`}
				/>
			</p>
		</div>
	);
};
