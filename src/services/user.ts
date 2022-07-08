import { supabase } from './supabase';
import { user, type User } from '../store/userStore';
import type { Provider, Session } from '@supabase/supabase-js';

const { VITE_PUBLIC_AUTH_REDIRECT: AUTH_REDIRECT } = import.meta.env;

const parseUserData = async (session: Session): Promise<User | null> => {
	if (session && session.user) {
		const { user } = session;
		const { user_metadata, id, email } = user;
		const { avatar_url, user_name: username } = user_metadata;
		const userData: User = {
			id,
			username: username ?? email?.split('@')[0],
			email,
			avatar_url: avatar_url ?? `https://i.pravatar.cc/1000?u=${session.user.id}`,
			token: session.access_token
		};
		await createUserProfile({ id, username, avatar_url });
		return userData;
	} else return null;
};

export async function signIn({ provider }: { provider: string }) {
	const { session, error } = await supabase.auth.signIn(
		{ provider: provider as Provider },
		{
			redirectTo: AUTH_REDIRECT
		}
	);
	if (!error && session && session.user) {
		user.set(await parseUserData(session));
	}
	return { session, error };
}

export async function logout() {
	await supabase.auth.signOut();
}

supabase.auth.onAuthStateChange(async (_evt, session) => {
	if (session) user.set(await parseUserData(session));
	else user.set(null);
});

export async function getAccessToken({ token }: { token: string }) {
	const res = await fetch('/api/twilio/get-access-token', {
		headers: {
			jwt: token
		}
	});

	if (!res.ok) throw new Error('Could not get access token');

	const { accessToken } = await res.json();
	return accessToken;
}

export type UserProfile = {
	id: string;
	username: string;
	avatar_url: string;
	accent_color?: string;
};

async function createUserProfile({
	id,
	username,
	avatar_url
}: {
	id: string;
	username: string;
	avatar_url: string;
}) {
	const { data, error } = await supabase
		.from<UserProfile>('profiles')
		.select()
		.filter('id', 'eq', id);
	if (!error) {
		if (data.length > 0) {
			await supabase.from<UserProfile>('profiles').update({ username }).match({ id });
		} else {
			await supabase.from<UserProfile>('profiles').insert({ id, username, avatar_url });
		}
	} else throw error;
}
