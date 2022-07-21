import { supabase } from '$services/supabase';
import { user, type User } from '$store/userStore';
import type { Provider, Session } from '@supabase/supabase-js';
import { goto } from '$app/navigation';

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
		await createUserProfile({ id, username: username ?? email?.split('@')[0], avatar_url });
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

export async function refreshUserSession({ session }: { session: Session | null }) {
	if (session) user.set(await parseUserData(session));
	else user.set(null);
}

supabase.auth.onAuthStateChange(async (_evt, session) => {
	refreshUserSession({ session });
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
		if (data.length >= 0) {
			await supabase.from<UserProfile>('profiles').insert({ id, username, avatar_url });
		}
	} else throw error;
}

export async function getAllUsers(): Promise<Array<UserProfile>> {
	const { data, error } = await supabase.from<UserProfile>('profiles').select();
	if (!error) return data;
	else return [];
}

export async function acceptInvitation({
	accessToken,
	sidToken,
	user
}: {
	accessToken: string;
	sidToken: string;
	user: User;
}) {
	const res = await fetch('/api/twilio/accept-invitation', {
		headers: {
			jwt: user.token,
			accessToken,
			sidToken
		}
	});

	if (res.status === 200 || res.status === 304) {
		const location = res.headers.get('Location');
		return { location: location ?? '/' };
	} else return await res.json();
}

export async function getUserConversations({ user }: { user: User }) {
	const res = await fetch('/api/twilio/get-conversations', {
		headers: {
			jwt: user.token
		}
	});

	return res.json();
}
