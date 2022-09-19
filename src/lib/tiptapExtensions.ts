import { lowlight } from "lowlight";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import { Heading } from "@tiptap/extension-heading";
import { Youtube } from "@tiptap/extension-youtube";
import { History } from "@tiptap/extension-history";
import { Document } from "@tiptap/extension-document";
import js from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Underline } from "@tiptap/extension-underline";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Typography } from "@tiptap/extension-typography";
import { BulletList } from "@tiptap/extension-bullet-list";
import markdown from "highlight.js/lib/languages/markdown";
import { Placeholder } from "@tiptap/extension-placeholder";
import { OrderedList } from "@tiptap/extension-ordered-list";
import typescript from "highlight.js/lib/languages/typescript";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

import { ListItem } from "$lib/listItem";
import { TabShortcut } from "$lib/tabShortcut";

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

export const extensions = [
	Text,
	Bold,
	Code,
	Strike,
	Italic,
	History,
	Document,
	ListItem,
	Underline,
	Gapcursor,
	Dropcursor,
	Typography,
	TabShortcut,
	Paragraph.configure({
		HTMLAttributes: {
			class: "break-all"
		}
	}),
	Youtube.configure({
		HTMLAttributes: {
			class: "w-full h-auto"
		}
	}),
	Link.configure({
		HTMLAttributes: {
			target: "_blank",
			// This is so a link icon can be after a link element to indicate it's a link
			class: "underline relative mr-7 after:content-[url(/dashboard/projects/project/link.svg)] after:w-5 after:h-5 after:top-0.5 after:absolute after:left-full after:ml-1 after:pointer-events-none"
		}
	}),
	OrderedList.configure({
		HTMLAttributes: {
			class: "list-decimal ml-8"
		}
	}),
	BulletList.configure({
		HTMLAttributes: {
			class: "list-disc ml-8"
		}
	}),
	Image.configure({
		HTMLAttributes: { class: "w-full rounded-lg" }
	}),
	CodeBlockLowlight.configure({
		HTMLAttributes: {
			class: "rounded-lg p-4 bg-gray-800"
		},
		lowlight
	}),
	Placeholder.configure({
		placeholder: ({ node }) => {
			switch (node.type.name) {
				case "heading":
					return "Title";
				case "paragraph":
					return "Write something special...";
				default:
					return "Start typing...";
			}
		},
		emptyNodeClass:
			"cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-gray-400 before-pointer-events-none"
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