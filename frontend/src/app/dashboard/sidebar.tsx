"use client";
import Image from "next/image";
import {
	ChartSquareBarIcon,
	ChatAlt2Icon,
	LogoutIcon,
	MenuIcon,
	XIcon,
} from "@heroicons/react/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

export default function Sidebar() {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const pathName = usePathname();
	const sidebarRef = useRef<HTMLElement | null>(null);

	return (
		<>
			<header className="block lg:hidden w-full p-4 bg-red py-6">
				<MenuIcon
					className="cursor-pointer w-6 h-6 stroke-slate-800"
					onClick={() => {
						sidebarRef.current?.classList.toggle("translate-x-[-100%]");
					}}
				/>
			</header>
			<section
				className="flex flex-col justify-between py-4 px-3 z-20 bg-white w-[180px] fixed-h left-0 translate-x-[-100%] transition-transform lg:relative lg:p-4 lg:translate-x-0"
				ref={sidebarRef}
			>
				<button
					className="rounded-md p-1 bg-gray-200 absolute top-2 right-2 block lg:hidden"
					onClick={() => {
						sidebarRef.current?.classList.toggle("translate-x-[-100%]");
					}}
				>
					<XIcon className="h-4 w-4 " />
				</button>
				<div>
					<a href="/" className="mb-10 block">
						<Image src="/logo-text.svg" width={120} height={50} alt="logo" />
					</a>
					<ul
						className="flex flex-col gap-2 mt-5"
						onClick={(ev) => {
							const target = ev.target as HTMLElement;
							//Check the link or the svg icon inside
							//WARNING: change this code if the SidebarLink has changed
							if (target.tagName == "A" || target.tagName == "SVG") {
								sidebarRef.current?.classList.toggle("translate-x-[-100%]");
							}
						}}
					>
						<LinkSidebar
							link="/dashboard/overview"
							label="Overview"
							selected={pathName.startsWith("/dashboard/overview")}
							Icon={ChartSquareBarIcon}
						/>
						<LinkSidebar
							link="/dashboard/discussions"
							label="Discussions"
							selected={pathName.startsWith("/dashboard/discussions")}
							Icon={ChatAlt2Icon}
						/>
					</ul>
				</div>
				<button
					className="hover:bg-purple-300/60 rounded-md p-2 flex flex-row gap-2 items-center"
					onClick={async () => {
						const { error } = await supabase.auth.signOut();
						if (!error) {
							router.push("/");
						}
					}}
				>
					<LogoutIcon className="h-6 w-6 stroke-black" />
					Logout
				</button>
			</section>
		</>
	);
}

interface LinkProps {
	link: string;
	label: string;
	selected?: boolean;
	Icon: (props: React.ComponentProps<"svg">) => React.JSX.Element;
}
const LinkSidebar = ({ link, label, selected, Icon }: LinkProps) => {
	return (
		<li
			className={`w-full rounded-md cursor-pointer text-slate-700 ${
				selected ? "bg-purple-500 text-white" : "hover:bg-purple-300/60 "
			}`}
		>
			<Link
				href={link}
				className="w-full h-full flex flex-row items-center gap-2 p-2"
			>
				<Icon className={`w-6 h-6 ${selected ? "stroke-white" : ""}`} />
				{label}
			</Link>
		</li>
	);
};
