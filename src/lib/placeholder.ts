import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

// Placeholders for different node types
const placeholders: { [key: string]: string } = {
	heading: "Title..."
};

export interface PlaceholderOptions {
	emptyEditorClass: string;
	emptyNodeClass: string;
}

export const Placeholder = Extension.create<PlaceholderOptions>({
	name: "placeholder",

	addOptions() {
		return {
			emptyEditorClass: "",
			emptyNodeClass: ""
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					decorations: ({ doc, selection }) => {
						const { anchor } = selection;
						const decorations: Decoration[] = [];

						if (!this.editor.isEditable) {
							return null;
						}

						doc.descendants((node, pos) => {
							const hasAnchor =
								anchor >= pos && anchor <= pos + node.nodeSize;
							const isEmpty = !node.isLeaf && !node.childCount;

							if (
								hasAnchor &&
								isEmpty &&
								this.editor.state.selection.visible
							) {
								const classes = [this.options.emptyNodeClass];

								if (this.editor.isEmpty) {
									classes.push(this.options.emptyEditorClass);
								}

								const decoration = Decoration.node(
									pos,
									pos + node.nodeSize,
									{
										class: classes.join(" "),
										"data-placeholder":
											placeholders[node.type.name] ||
											"Start typing..."
									}
								);

								decorations.push(decoration);
							}

							return false;
						});

						return DecorationSet.create(doc, decorations);
					}
				}
			})
		];
	}
});
