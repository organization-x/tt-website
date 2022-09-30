import { Extension } from "@tiptap/core";

// Modified behavior extenstion, insert tab on tab press and list behavoiral changes.
export const tabShortcut = Extension.create({
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
