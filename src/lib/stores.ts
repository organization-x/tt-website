import { writable } from "svelte/store";

export const user = writable<App.UserWithMetadata>();
