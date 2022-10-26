import { lowlight } from "lowlight";
import { Extension } from "@tiptap/core";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "$lib/placeholder";
import { Image } from "@tiptap/extension-image";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import { Heading } from "@tiptap/extension-heading";
import { Document } from "@tiptap/extension-document";
import { ListItem } from "@tiptap/extension-list-item";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Underline } from "@tiptap/extension-underline";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Typography } from "@tiptap/extension-typography";
import { BulletList } from "@tiptap/extension-bullet-list";
import markdown from "highlight.js/lib/languages/markdown";
import { OrderedList } from "@tiptap/extension-ordered-list";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

// Generating HTML using Tiptap requires me to re-define all the HTML attributes for every extension.
// It's super annoying but if we want SSR there's no workaround so I decided to just host them all in one file

// These languages were picked based off of the most common languages at tt.
// We don't want to import everything since that will send 3MB+ of data to the client
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("json", json);
lowlight.registerLanguage("bash", bash);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("markdown", markdown);
lowlight.registerLanguage("typescript", typescript);
lowlight.registerLanguage("javascript", javascript);

// Tab behavoir change for lists
const tabShortcut = Extension.create({
	name: "tabShortcut",

	addKeyboardShortcuts() {
		return {
			Tab: ({ editor }) => {
				if (
					editor.isActive("listItem") &&
					editor.can().sinkListItem("listItem")
				)
					return editor.commands.sinkListItem("listItem");

				editor.chain().insertContent("	").run();

				return true;
			}
		};
	}
});

export const extensions = [
	Text,
	Bold,
	Code,
	Strike,
	Italic,
	Document,
	ListItem,
	Underline,
	Paragraph,
	Dropcursor,
	Typography,
	tabShortcut,
	Link.configure({
		HTMLAttributes: {
			target: "_blank",
			// This is so a link icon can be after a link element to indicate it's a link
			class: "underline cursor-pointer relative mr-7 after:content-[url(/assets/dashboard/projects/project/link.svg)] after:w-5 after:h-5 after:top-0.5 after:absolute after:left-full after:ml-1 after:pointer-events-none"
		}
	}),
	OrderedList.extend({
		addKeyboardShortcuts() {
			return {
				Backspace: () => {
					// On backspace, lift the list item if in the right scenario before anything else. And if backspace is pressed on an empty paragraph
					// below a list item, don't create another listen item

					// Check if the editor is active on a list item and is able to lift it, if so lift the list item
					if (
						this.editor.isActive("listItem") &&
						this.editor.state.selection.$from.parentOffset === 0 &&
						this.editor.state.selection.empty &&
						this.editor.can().liftListItem("listItem")
					) {
						this.editor.commands.liftListItem("listItem");

						return true;
					}

					// TODO: Fix weird bullet point behavoir, currently can't unselect node
					if (
						this.editor.state.selection.empty &&
						this.editor.state.selection.$from.parentOffset === 0 &&
						this.editor.state.doc.content.childCount > 1
					) {
						// If the editor is on an empty newline with no offset to the parent
						// Grab the current node at the cursor.

						this.editor.commands.selectNodeBackward();

						// If the the previous node is non existant or the type isn't a bulletList ignore
						const isList =
							this.editor.state.selection.content().content
								.firstChild?.type.name !== "bulletList";

						if (isList) return false;

						this.editor.commands.deleteSelection();

						// If there is content, shift it up to the next line
						// if (node.textContent.length) {
						// 	// Insert the stored content
						// 	this.editor.commands.insertContent(
						// 		node.textContent
						// 	);

						// 	// Move the cursor to the start of the inserted content
						// 	this.editor.commands.setTextSelection(
						// 		this.editor.state.selection.anchor -
						// 			node.textContent.length
						// 	);
						// }

						// If there is content, shift it up to the next line
						// if (node.textContent.length) {
						// 	// Insert the stored content
						// 	this.editor.commands.insertContent(
						// 		node.textContent
						// 	);

						// 	// Move the cursor to the start of the inserted content
						// 	this.editor.commands.setTextSelection(
						// 		this.editor.state.selection.anchor -
						// 			node.textContent.length
						// 	);
						// }

						return true;
					}

					return false;
				}
			};
		}
	}).configure({
		HTMLAttributes: {
			class: "list-decimal pl-8"
		}
	}),
	BulletList.configure({
		HTMLAttributes: {
			class: "list-disc pl-8"
		}
	}),
	Image.configure({
		HTMLAttributes: { class: "w-full rounded-lg max-w-xs mx-auto" }
	}),
	CodeBlockLowlight.configure({
		HTMLAttributes: {
			class: "rounded-lg p-4 bg-gray-800"
		},
		lowlight
	}),
	Placeholder.configure({
		emptyNodeClass:
			"before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before-pointer-events-none"
	}),
	Heading.extend({
		levels: [1, 2, 3],
		renderHTML({ node }) {
			switch (node.attrs.level) {
				case 1:
					return ["h1", { class: "font-bold text-2xl" }, 0];
				case 2:
					return ["h2", { class: "font-bold text-xl" }, 0];
				case 3:
					return ["h3", { class: "font-bold text-lg" }, 0];
				// Should never reach
				default:
					return ["h1", { class: "font-bold text-2xl" }, 0];
			}
		}
	})
];
