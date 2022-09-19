import { Extension } from "@tiptap/core";

export const TabShortcut = Extension.create({
	name: "tabShortcut",

	addKeyboardShortcuts() {
		return {
			Tab: ({ editor }) => {
				editor.chain().insertContent("	").run();

				return true;
			}
		};
	}
});
