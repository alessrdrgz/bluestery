import { writable } from 'svelte/store';

export type User = {
	id: string;
	username: string;
	email?: string;
	avatar_url: string;
	token: string;
};

export const user = writable<User | null>(null);
