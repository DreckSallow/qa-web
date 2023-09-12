export default function Landing() {
	return (
		<>
			<Login />
			<section className="w-full flex flex-col sm:flex-row h-screen items-center justify-around mt-[-80px]">
				<div>
					<h2 className="text-6xl font-bold mb-6">
						Start Your <span className="text-purple-500">Q&A</span>
						<br /> Journey
					</h2>
					<a
						href="/login"
						className="bg-purple-500 text-white font-semibold rounded-md py-2 px-3"
					>
						Start now
					</a>
				</div>
				<div className="w-[40%] h-6 bg-blue-300"></div>
			</section>
			<section className="px-4 py-2 flex flex-col items-center justify-center">
				<h2 className="text-3xl font-semibold mb-6">How it works</h2>
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
		</>
	);
}

const Login = () => {
	return (
		<header className="sticky flex top-0 w-full h-[80px] justify-center px-4">
			<nav className="flex flex-row justify-between items-center w-full">
				<div>ASK</div>
				<div>
					<ul className="flex flex-row gap-4">
						<a href="/about">About</a>
						<a href="/github">Github</a>
					</ul>
				</div>
				<a
					href="/login"
					className="rounded-full bg-purple-500 text-white py-2 px-3 text-sm font-semibold"
				>
					Sign In
				</a>
			</nav>
		</header>
	);
};
