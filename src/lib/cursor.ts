import { writable } from "svelte/store";
import { Extension } from "@tiptap/core";
import { yCursorPlugin } from "y-prosemirror";

import Cursor from "$lib/components/dashboard/projects/Cursor.svelte";

import type { Writable } from "svelte/store";
import type { WebsocketProvider } from "y-websocket";
import type { Awareness } from "y-protocols/awareness";

export const CollaborationCursor = Extension.create<
	{
		provider: WebsocketProvider | null;
		user: { name: string | null; id: string | null; color: string | null };
	},
	{
		update: Writable<number>;
		users: Writable<{ name: string; id: string; color: string }[]>;
		cursors: { [key: string]: Cursor };
	}
>({
	name: "collaborationCursor",

	addOptions() {
		return {
			provider: null,
			user: {
				name: null,
				id: null,
				color: null
			}
		};
	},

	// Store the current users and also create an update writable that triggers the cursor component
	// to update when a transaction occurs
	addStorage() {
		return {
			update: writable(0),
			users: writable([]),
			cursors: {}
		};
	},

	onTransaction() {
		this.storage.update.set(Math.random());
	},

	addProseMirrorPlugins() {
		return [
			// Setup the ycursor plugin with the custom cursor builder
			yCursorPlugin(
				(() => {
					const awarenessStatesToArray = (
						states: Awareness["states"]
					) => {
						let array = [];

						for (const [_, { user }] of states) {
							if (user.id === this.options.user.id) continue;

							array.push(user);
						}

						return array;
					};

					this.options.provider!.awareness.setLocalStateField(
						"user",
						this.options.user
					);

					this.storage.users.set(
						awarenessStatesToArray(
							this.options.provider!.awareness.states
						)
					);

					this.options.provider!.awareness.on("update", () =>
						this.storage.users.set(
							awarenessStatesToArray(
								this.options.provider!.awareness.states
							)
						)
					);

					return this.options.provider!.awareness;
				})(),
				{
					cursorBuilder: ({ name, color, id }) => {
						const parent = document.createElement("span");

						// Destroy the component so listeners are removed
						this.storage.cursors[id]?.$destroy();

						this.storage.cursors[id] = new Cursor({
							target: parent,
							props: { name, color, update: this.storage.update }
						});

						return parent.firstElementChild as HTMLElement;
					}
				}
			)
		];
	}
});
