"use client";
import { Card } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabase } from "../context";
import { useSyncForm, useModal, InputFieldsStr } from "@/hooks";
import { ModalDialog } from "@/app/components/modals";
import { PencilIcon, XIcon } from "@heroicons/react/outline";

interface Discussion {
	id: string;
	title: string;
	description: string;
}

const formModal = {
	title: {
		required: true,
	},
	description: {
		required: true,
	},
};

export default function DiscussionsPage() {
	const [discussions, setDiscussions] = useState<Discussion[]>([]);
	const router = useRouter();
	const { session, supabase } = useSupabase();
	const { ref, openModal, closeModal } = useModal();
	const [formStatus, setFormStatus] = useState<
		"create" | { type: "edit"; id: string }
	>("create");
	const { errors, handleInput, handleSubmit, setValues, value } =
		useSyncForm(formModal);

	useEffect(() => {
		supabase
			.from("discussions")
			.select("id,title,description")
			.eq("user_id", session.user.id)
			.then((res) => {
				if (res.error) {
					return console.log("ERROR: ", res.error);
				}
				setDiscussions(res.data);
			});
	}, []);

	const handleCreation = (values: InputFieldsStr) => {
		if (formStatus === "create") {
			supabase
				.from("discussions")
				.insert({
					title: values["title"],
					description: values["description"],
					user_id: session.user.id,
				})
				.select("id,title,description")
				.then(({ data, error }) => {
					if (error) {
					} else if (data[0]) {
						setDiscussions((c) => c.concat(data[0]));
					}
					closeModal();
				});
		} else {
			const data = {
				title: values["title"] as string,
				description: values["description"] as string,
			};
			supabase
				.from("discussions")
				.update(data)
				.eq("id", formStatus.id)
				.then(({ error }) => {
					if (error) return;
					setDiscussions((list) =>
						list.map((d) =>
							d.id === formStatus.id ? { ...data, id: formStatus.id } : d,
						),
					);
					closeModal();
				});
		}
	};

	const handleRemove = (dId: string) => {
		supabase
			.from("discussions")
			.delete()
			.eq("id", dId)
			.then(({ data, error }) => {
				if (error) {
					return;
				}
				setDiscussions((d) => d.filter(({ id }) => id != dId));
			});
	};

	return (
		<main className="p-6">
			<header className="border-b-2 border-gray-200 flex flex-row items-end pb-8">
				<div>
					<h1 className="text-4xl font-semibold text-slate-800">Discussions</h1>
					<p className="mt-4 text-slate-600">See your open discussions</p>
				</div>
				<div className="ml-10">
					<button
						onClick={() => {
							setValues({ title: "", description: "" });
							setFormStatus("create");
							openModal();
						}}
						className="button text-sm text-white bg-purple-600"
					>
						Create
					</button>
				</div>
			</header>
			<DiscussSection
				discussions={discussions}
				onSelect={(id) => router.push(`/dashboard/discussions/${id}`)}
				onRemove={handleRemove}
				onEdit={(dId) => {
					const finded = discussions.find(({ id }) => id === dId);
					if (finded) {
						setValues({
							title: finded.title,
							description: finded.description,
						});
						setFormStatus({ type: "edit", id: dId });
						openModal();
					}
				}}
			/>
			<ModalDialog
				className="backdrop:bg-black/50"
				onClose={closeModal}
				ref={ref}
			>
				<h2 className="text-xl font-semibold mr-12">Create discussion</h2>
				<form
					className="bg-red flex flex-col mt-4"
					onSubmit={handleSubmit(handleCreation)}
				>
					<div className="mb-6">
						<label className="block text-sm font-medium mb-2" htmlFor="d-title">
							Title
						</label>
						<input
							value={value("title")}
							onInput={handleInput("title")}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-400 w-full py-2 px-3"
							id="d-title"
						/>
						<p className="text-red-500 text-xs italic">{errors["title"]}</p>
					</div>
					<div className="">
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="d-description"
						>
							Description
						</label>
						<textarea
							value={value("description")}
							onInput={handleInput("description")}
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-purple-400 w-full py-2 px-3 resize-none"
							id="d-description"
						/>
						<p className="text-red-500 text-xs italic">
							{errors["description"]}
						</p>
					</div>
					<div className="w-full mt-4 flex justify-end">
						<button
							type="submit"
							className="button text-white text-sm bg-purple-400"
						>
							Create
						</button>
					</div>
				</form>{" "}
			</ModalDialog>
		</main>
	);
}

interface DiscussProps {
	onSelect: (d: Discussion["id"]) => void;
	onRemove: (d: Discussion["id"]) => void;
	onEdit: (d: Discussion["id"]) => void;
	discussions: Discussion[];
}

const DiscussSection = ({
	onSelect,
	discussions,
	onRemove,
	onEdit,
}: DiscussProps) => {
	return (
		<section className="mt-4 flex flex-row gap-8 flex-wrap">
			{discussions.map((d, i) => {
				return (
					<Card
						className="max-w-xs hover:cursor-pointer hover:-translate-y-1 transform transition duration-900 relative"
						key={i}
						onClick={() => {
							onSelect(d.id);
						}}
					>
						<h2 className="text-lg font-semibold mb-2 text-slate-700">
							{d.title}
						</h2>
						<p className="mt-2 text-slate-600">{d.description}</p>
						<div className="flex flex-col gap-4 absolute top-[-10px] right-[-10px]">
							<button
								className="rounded-full p-1.5 bg-red-400"
								onClick={(ev) => {
									ev.stopPropagation();
									onRemove(d.id);
								}}
							>
								<XIcon className="h-3.5 w-3.5 stroke-white" />
							</button>
							<button
								className="rounded-full p-1.5 bg-blue-400"
								onClick={(ev) => {
									ev.stopPropagation();
									onEdit(d.id);
								}}
							>
								<PencilIcon className="h-3.5 w-3.5 stroke-white" />
							</button>
						</div>
					</Card>
				);
			})}
		</section>
	);
};
