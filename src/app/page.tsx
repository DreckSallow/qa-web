import Image from "next/image";

export default function Landing() {
	return (
		<>
			<HeaderNav />
			<section className="w-full flex flex-col md:flex-row min-h-screen items-center justify-around md:mt-[-80px]">
				<div>
					<h2 className="text-7xl font-bold mb-6">
						Start Your <span className="text-purple-500">Q&A</span>
						<br /> Journey
					</h2>
					<a
						href="/signup"
						className="bg-purple-500 text-white font-semibold rounded-md py-2 px-3"
					>
						Start now
					</a>
				</div>
				<div>
					<Image
						src="https://cdn1.vectorstock.com/i/1000x1000/85/05/phone-text-message-vector-2668505.jpg"
						alt="phone"
						width={300}
						height={700}
					/>
				</div>
			</section>
			<section className="px-4 py-2 flex flex-col items-center justify-center">
				<h2 className="text-3xl font-semibold mb-3">How it works</h2>
				<h4 className="mb-5">
					Simplify the process of interacting with your community in 3 simple
					steps:
				</h4>
				<div className="flex flex-row gap-4">
					<div className="card border-gray-200">
						<h3 className="text-lg font-semibold">Open a topic</h3>
						<p>Open any topic to interact with your community</p>
					</div>
					<div className="card border-gray-200">
						<h3 className="text-lg font-semibold">
							Interact with your community
						</h3>
						<p>Open any topic to interact with your community</p>
					</div>
					<div className="card border-gray-200">
						<h3 className="text-lg font-semibold">Close the topic</h3>
						<p>Close the space when you want.</p>
					</div>{" "}
				</div>
			</section>
			<section className="py-28 flex flex-col justify-center items-center text-center bg-purple-500 text-white mt-12">
				<h2 className="font-bold text-7xl mb-10">
					Start to interact <br /> with your community
				</h2>
				<a
					href="/signup"
					className="py-3 px-4 rounded-md bg-black text-xl font-semibold hover:opacity-70"
				>
					Start now
				</a>
			</section>
		</>
	);
}

const HeaderNav = () => {
	return (
		<header className="sticky flex top-0 w-full h-[80px] justify-center px-4 z-10 backdrop-blur-sm">
			<nav className="flex flex-row justify-between items-center w-full">
				<div>ASK</div>
				<div>
					<ul className="flex flex-row gap-4">
						<a href="/about">About</a>
						<a href="https://github.com/DreckSallow/qa-web" target="_blank">
							Github
						</a>
					</ul>
				</div>
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
