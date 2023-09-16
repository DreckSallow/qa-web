import { SendEmailIcon } from "../components/icons";

export default function VerifyEmailPage() {
	return (
		<main className="flex justify-center items-center h-screen w-full">
			<div className="rounded-lg p-6 flex flex-col items-center card border-gray-400">
				<SendEmailIcon className="h-12 w-12 stroke-1" />
				<h2 className="text-4xl font-semibold ">Validate your email</h2>
				<hr className="h-[2px] w-full bg-gray-300 mt-4" />
				<div className="p-4 mt-4 flex flex-col items-center">
					<p className="text-xl max-w-[400px]">
						Please <span className="text-purple-400">check your inbox </span>{" "}
						and click the verification link we have sent to your email address.{" "}
					</p>
					<a
						className="text-blue-600 mt-3 inline-block underline hover:no-underline"
						href="/"
					>
						Go to Home
					</a>
				</div>
			</div>
		</main>
	);
}
