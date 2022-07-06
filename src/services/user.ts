import { supabase } from './supabase';
import { user, type User } from '../store/userStore';
import type { Provider, Session } from '@supabase/supabase-js';

const parseUserData = (session: Session): User | null => {
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
		return userData;
	} else return null;
};

export async function signIn({ provider }: { provider: string }) {
	const { session, error } = await supabase.auth.signIn({ provider: provider as Provider });
	if (!error && session && session.user) {
		user.set(parseUserData(session));
	}
	return { session, error };
}

export async function logout() {
	await supabase.auth.signOut();
}

supabase.auth.onAuthStateChange((_evt, session) => {
	if (session) user.set(parseUserData(session));
	else user.set(null);
});
