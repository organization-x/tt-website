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
				editor.commands.liftListItem("listItem"),
			Tab: ({ editor }) => editor.commands.sinkListItem("listItem"),
			Backspace: ({ editor }) => {
				// If there is a selection or the editor isn't active on an empty listItem, don't handle this keypress
				if (
					!editor.isActive("listItem") ||
					editor.state.selection.$from.parentOffset !== 0 ||
					!editor.state.selection.empty
				)
					return false;

				editor.commands.liftListItem("listItem");
				return true;
			}
		};
	}
});
