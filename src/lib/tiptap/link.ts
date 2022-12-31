import { test, find } from "linkifyjs";
import { writable } from "svelte/store";
import { Plugin, PluginKey } from "prosemirror-state";
import {
	Mark,
	markPasteRule,
	getMarksBetween,
	getChangedRanges,
	findChildrenInRange,
	combineTransactionSteps,
	type CommandProps
} from "@tiptap/core";

import LinkMark from "./LinkMark.svelte";

import type { MarkType } from "prosemirror-model";

// Typing for the extension commands
declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		link: {
			setLink: (attributes: { href: string; id: string }) => ReturnType;
			toggleLink: (attributes: {
				href: string;
				id: string;
			}) => ReturnType;
			unsetLink: (id: string) => ReturnType;
		};
	}
}

// Keep track of the link marks made so that they can be destroyed properly
const linkMarks: { [key: string]: LinkMark } = {};

const autoLinker = ({ type }: { type: MarkType }) => {
	return new Plugin({
		key: new PluginKey("autolink"),
		appendTransaction: (transactions, oldState, newState) => {
			const preventAutolink = transactions.some((transaction) =>
				transaction.getMeta("preventAutolink")
			);

			if (preventAutolink) return;

			const docChanged =
				transactions.some((transaction) => transaction.docChanged) &&
				!oldState.doc.eq(newState.doc);

			if (!docChanged) return;

			const { tr } = newState;
			const transform = combineTransactionSteps(oldState.doc, [
				...transactions
			]);

			const { mapping } = transform;
			const changes = getChangedRanges(transform);

			changes.forEach(({ oldRange, newRange }) => {
				// Check if we have to remove links
				getMarksBetween(oldRange.from, oldRange.to, oldState.doc)
					.filter((item) => item.mark.type === type)
					.forEach((oldMark) => {
						const newFrom = mapping.map(oldMark.from);
						const newTo = mapping.map(oldMark.to);
						const newMarks = getMarksBetween(
							newFrom,
							newTo,
							newState.doc
						).filter((item) => item.mark.type === type);

						// If the mark was deleted, destroy the component
						if (!newMarks.length) {
							linkMarks[oldMark.mark.attrs.id].$destroy();
							delete linkMarks[oldMark.mark.attrs.id];

							return;
						}

						const newMark = newMarks[0];
						const oldLinkText = oldState.doc.textBetween(
							oldMark.from,
							oldMark.to,
							undefined,
							" "
						);
						const newLinkText = newState.doc.textBetween(
							newMark.from,
							newMark.to,
							undefined,
							" "
						);

						const wasLink = test(oldLinkText);
						const isLink = test(newLinkText);

						// Remove only the link, if it was a link before too
						// because we don’t want to remove links that were set manually
						if (wasLink && !isLink) {
							linkMarks[oldMark.mark.attrs.id].$destroy();
							delete linkMarks[oldMark.mark.attrs.id];
							tr.removeMark(newMark.from, newMark.to, type);
						}
					});

				// Now let’s see if we can add new links
				const nodesInChangedRanges = findChildrenInRange(
					newState.doc,
					newRange,
					(node) => node.isTextblock
				);

				let textBlock;
				let textBeforeWhitespace;
				if (nodesInChangedRanges.length > 1) {
					// Grab the first node within the changed ranges (ex. the first of two paragraphs when hitting enter)
					textBlock = nodesInChangedRanges[0];
					textBeforeWhitespace = newState.doc.textBetween(
						textBlock.pos,
						textBlock.pos + textBlock.node.nodeSize,
						undefined,
						" "
					);
				} else if (
					nodesInChangedRanges.length &&
					// We want to make sure to include the block seperator argument to treat hard breaks like spaces
					newState.doc
						.textBetween(newRange.from, newRange.to, " ", " ")
						.endsWith(" ")
				) {
					textBlock = nodesInChangedRanges[0];
					textBeforeWhitespace = newState.doc.textBetween(
						textBlock.pos,
						newRange.to,
						undefined,
						" "
					);
				}

				if (textBlock && textBeforeWhitespace) {
					const wordsBeforeWhitespace = textBeforeWhitespace
						.split(" ")
						.filter((s) => s !== "");

					if (wordsBeforeWhitespace.length <= 0) return false;

					const lastWordBeforeSpace =
						wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
					const lastWordAndBlockOffset =
						textBlock.pos +
						textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);

					if (!lastWordBeforeSpace) return false;

					find(lastWordBeforeSpace)
						.filter(
							(link) =>
								link.isLink &&
								(link.value.startsWith("http") ||
									link.value.startsWith("https"))
						)
						// Calculate link position
						.map((link) => ({
							...link,
							from: lastWordAndBlockOffset + link.start + 1,
							to: lastWordAndBlockOffset + link.end + 1
						}))
						// Add the link mark
						.forEach((link) => {
							// Generate a random ID to keep track of this mark so it
							// can be properly destroyed later
							const id = Math.random()
								.toString(36)
								.substring(2, 9);

							tr.addMark(
								link.from,
								link.to,
								type.create({
									href: link.href,
									id
								})
							);
						});
				}
			});

			if (!tr.steps.length) return;

			return tr;
		}
	});
};

// Preview link information on hover
const linkPreview = ({ type }: { type: MarkType }) => {
	return new Plugin({
		key: new PluginKey("linkPreview"),
		props: {
			markViews: {
				[type.name]: ({ attrs }) => {
					const parent = document.createElement("span");
					const content = document.createElement("p");

					parent.setAttribute(
						"class",
						"relative inline-flex max-w-full overflow-hidden"
					);
					parent.setAttribute("href", attrs.href);
					content.setAttribute(
						"class",
						"underline break-words max-w-full"
					);
					parent.appendChild(content);

					// Create a writable that keeps track if it's being hovered or not
					const active = writable(false);

					// Create a debounce so users can hover over the preview and it stays open
					let debounce: NodeJS.Timer;
					const set = (value: boolean) => {
						clearTimeout(debounce);

						value
							? active.set(true)
							: (debounce = setTimeout(
									() => active.set(false),
									80
							  ));
					};

					content.addEventListener("mouseenter", () => set(true));
					content.addEventListener("mouseleave", () => set(false));

					linkMarks[attrs.id] = new LinkMark({
						target: parent,
						props: { href: attrs.href, active, set }
					});

					return {
						dom: parent,
						contentDOM: parent.firstElementChild as HTMLElement
					};
				}
			}
		}
	});
};

export const Link = Mark.create({
	name: "link",
	priority: 1000,
	keepOnSplit: false,

	addAttributes() {
		return {
			href: {
				default: null
			},
			id: {
				default: null
			}
		};
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"a",
			{
				class: "underline flex flex-row-reverse gap-1 w-fit items-center",
				target: "_blank",
				href: HTMLAttributes.href
			},
			[
				"img",
				{
					class: "w-3 h-3 mt-[0.3rem]",
					width: "24",
					height: "24",
					alt: "Link icon",
					src: "/assets/projects/project/link.svg"
				}
			]
		];
	},

	addCommands() {
		return {
			setLink:
				(attributes) =>
				({ chain }: CommandProps) => {
					return chain()
						.setMark(this.name, attributes)
						.setMeta("preventAutolink", true)
						.run();
				},
			toggleLink:
				(attributes) =>
				({ chain }: CommandProps) => {
					return chain()
						.toggleMark(this.name, attributes, {
							extendEmptyMarkRange: true
						})
						.setMeta("preventAutolink", true)
						.run();
				},
			unsetLink:
				(id) =>
				({ chain }: CommandProps) => {
					chain()
						.unsetMark(this.name, { extendEmptyMarkRange: true })
						.setMeta("preventAutolink", true)
						.run();

					linkMarks[id].$destroy();
					delete linkMarks[id];

					return true;
				}
		};
	},

	addPasteRules() {
		return [
			markPasteRule({
				find: (text) =>
					find(text)
						.filter((link) => link.isLink)
						.map((link) => ({
							text: link.value,
							index: link.start,
							data: link
						})),

				type: this.type,

				getAttributes: (match) => {
					return {
						href: !match.data ? null : match.data.href,
						id: !match.data ? null : match.data.id
					};
				}
			})
		];
	},

	addProseMirrorPlugins() {
		return [
			autoLinker({
				type: this.type
			}),
			linkPreview({
				type: this.type
			})
		];
	}
});
