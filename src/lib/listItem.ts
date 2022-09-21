import { Node } from "@tiptap/core";

export const ListItem = Node.create({
	name: "listItem",

	content: "paragraph block*",

	defining: true,

	parseHTML() {
		return [
			{
				tag: "li"
			}
		];
	},

	renderHTML() {
		return ["li", {}, 0];
	},

	addKeyboardShortcuts() {
		return {
			Enter: ({ editor }) => editor.commands.splitListItem("listItem"),
			"Shift-Tab": ({ editor }) =>
				editor.commands.liftListItem("listItem")
		};
	}
});
