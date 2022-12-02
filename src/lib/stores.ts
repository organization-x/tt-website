import { writable } from "svelte/store";

// Store user object for use on dashboard
export const user = writable<App.UserWithMetadata>();

// Allow customers to save developers
export const developers =
	writable<{ id: string; name: string; url: string }[]>();
