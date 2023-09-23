"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const pathName = usePathname();
	return (
		<section className="w-[180px] p-4 flex flex-col justify-between">
			<div>
				<a href="/" className="text-xl font-semibold text-purple-600">
					ASK
				</a>
				<ul
					className="flex flex-col gap-2 mt-5"
					onClick={(e) => {
						e.preventDefault();
						const target = e.target as HTMLElement;
						if (target.tagName === "A") {
							router.push(target.getAttribute("href") as string);
						}
					}}
				>
					<LinkSidebar
						link="/dashboard/overview"
						label="Overview"
						selected={pathName.startsWith("/dashboard/overview")}
					/>
					<LinkSidebar
						link="/dashboard/discussions"
						label="Discussions"
						selected={pathName.startsWith("/dashboard/discussions")}
					/>
				</ul>
			</div>
			<button
				className="hover:bg-purple-100/60 rounded-md p-2 text-start"
				onClick={async () => {
					const { error } = await supabase.auth.signOut();
					if (!error) {
						router.push("/");
					}
				}}
			>
				Logout
			</button>
		</section>
	);
}

interface LinkProps {
	link: string;
	label: string;
	selected?: boolean;
}
const LinkSidebar = ({ link, label, selected }: LinkProps) => {
	return (
		<li
			className={`w-full rounded-md p-2 hover:bg-purple-100/60 cursor-pointer ${
				selected ? "border-r-4 border-purple-500 text-purple-600" : ""
			}`}
		>
			<a href={link} className="inline-block w-full h-full">
				{" "}
				{label}
			</a>
		</li>
	);
};
