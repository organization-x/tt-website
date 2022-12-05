import { Link } from "$lib/link";
import { lowlight } from "lowlight";
import { Extension } from "@tiptap/core";
import c from "highlight.js/lib/languages/c";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Placeholder } from "$lib/placeholder";
import go from "highlight.js/lib/languages/go";
import { Image } from "@tiptap/extension-image";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import cpp from "highlight.js/lib/languages/cpp";
import sql from "highlight.js/lib/languages/sql";
import php from "highlight.js/lib/languages/php";
import { Italic } from "@tiptap/extension-italic";
import { Strike } from "@tiptap/extension-strike";
import java from "highlight.js/lib/languages/java";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import rust from "highlight.js/lib/languages/rust";
import perl from "highlight.js/lib/languages/perl";
import ruby from "highlight.js/lib/languages/ruby";
import yaml from "highlight.js/lib/languages/yaml";
import { Heading } from "@tiptap/extension-heading";
import swift from "highlight.js/lib/languages/swift";
import { Plugin, PluginKey } from "prosemirror-state";
import { Document } from "@tiptap/extension-document";
import { ListItem } from "@tiptap/extension-list-item";
import python from "highlight.js/lib/languages/python";
import kotlin from "highlight.js/lib/languages/kotlin";
import csharp from "highlight.js/lib/languages/csharp";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Underline } from "@tiptap/extension-underline";
import graphql from "highlight.js/lib/languages/graphql";
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

// These languages were picked based off of the languages provided in the skill icons and what
// HLJS supports. We don't want to import everything since that will send 3MB+ of data to the client
lowlight.registerLanguage("c", c);
lowlight.registerLanguage("go", go);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("sql", sql);
lowlight.registerLanguage("php", php);
lowlight.registerLanguage("cpp", cpp);
lowlight.registerLanguage("xml", xml);
lowlight.registerLanguage("html", xml);
lowlight.registerLanguage("json", json);
lowlight.registerLanguage("bash", bash);
lowlight.registerLanguage("rust", rust);
lowlight.registerLanguage("perl", perl);
lowlight.registerLanguage("ruby", ruby);
lowlight.registerLanguage("java", java);
lowlight.registerLanguage("yaml", yaml);
lowlight.registerLanguage("swift", swift);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("kotlin", kotlin);
lowlight.registerLanguage("csharp", csharp);
lowlight.registerLanguage("graphql", graphql);
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
	Link,
	Strike,
	Italic,
	Document,
	ListItem,
	Underline,
	Dropcursor,
	Typography,
	tabShortcut,
	Paragraph.configure({
		HTMLAttributes: { class: "break-words" }
	}),
	OrderedList.configure({
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
		HTMLAttributes: {
			class: "rounded-lg max-h-96 mx-auto"
		}
	}),
	CodeBlockLowlight.configure({
		HTMLAttributes: {
			class: "rounded-lg p-4 bg-gray-900"
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
					return [
						"h1",
						{ class: "font-bold text-2xl break-words" },
						0
					];
				case 2:
					return [
						"h2",
						{ class: "font-bold text-xl break-words" },
						0
					];
				case 3:
					return [
						"h3",
						{ class: "font-bold text-lg break-words" },
						0
					];
				// Should never reach
				default:
					return [
						"h1",
						{ class: "font-bold text-2xl break-words" },
						0
					];
			}
		}
	})
];
