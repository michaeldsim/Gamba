import { writable } from "svelte/store";

export const backendUrl = writable('');
export const backendUrlFound = writable(false);