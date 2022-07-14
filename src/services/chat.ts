import { Client, Conversation } from '@twilio/conversations';
import { supabase } from './supabase';
import type { UserProfile } from './user';

export async function createOrJoinConversation({
	room,
	accessToken
}: {
	room: string;
	accessToken: string;
}): Promise<Conversation | { message: string; error: boolean }> {
	const client = new Client(accessToken);

	return new Promise((resolve) => {
		client.on('stateChanged', async (state) => {
			if (state === 'initialized') {
				let conversation;

				try {
					conversation = await client.createConversation({ uniqueName: room });
					resolve(conversation);
				} catch (e) {
					if (e instanceof Error && e.message === 'Conflict') {
						try {
							conversation = await client.getConversationByUniqueName(room);
							resolve(conversation);
						} catch (e) {
							if (e instanceof Error && e.message === 'Forbidden') {
								resolve({ message: `No tienes acceso a este chat`, error: true });
							} else resolve({ message: e as string, error: true });
						}
					}
				}
			}
		});

		client.on('connectionError', (error) => console.error(error));
	});
}

export async function getAllUsersFromConversation({
	conversation
}: {
	conversation: Conversation;
}): Promise<Array<UserProfile>> {
	const users = await conversation.getParticipants();
	const usersProfiles = [];
	for (const user of users) {
		const { data, error } = await supabase
			.from<UserProfile>('profiles')
			.select()
			.filter('id', 'eq', user.identity);
		if (!error && data.length > 0) usersProfiles.push(data[0]);
	}

	return usersProfiles;
}

export async function addUserToConversation({
	conversation,
	username
}: {
	conversation: Conversation;
	username: string;
}): Promise<{ message: string; error?: boolean }> {
	const user = await supabase
		.from<UserProfile>('profiles')
		.select()
		.filter('username', 'eq', username);
	if (user.data && user.data.length > 0) {
		try {
			await conversation.add(user.data[0].id);
			return { message: `Usuario ${username} añadido al chat` };
		} catch (e) {
			if (e instanceof Error) {
				if (e.message === 'Conflict') {
					return { message: `El usuario ${username} ya forma parte del chat`, error: true };
				} else return { message: e.message, error: true };
			} else return { message: e as string, error: true };
		}
	} else return { message: `No se ha encontrado el usuario: ${username}`, error: true };
}

export async function generateConversationInviteUrl({
	token,
	sid
}: {
	token: string;
	sid: string;
}) {
	return fetch('/api/twilio/generate-invite-url', {
		headers: {
			jwt: token,
			sid
		}
	}).then((res) => res.json());
}
