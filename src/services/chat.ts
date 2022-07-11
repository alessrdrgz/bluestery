import { Client, Conversation } from '@twilio/conversations';
import { supabase } from './supabase';
import type { UserProfile } from './user';

export async function createOrJoinConversation({
	room,
	accessToken
}: {
	room: string;
	accessToken: string;
}): Promise<Conversation | null> {
	const client = new Client(accessToken);

	return new Promise((resolve, reject) => {
		client.on('stateChanged', async (state) => {
			if (state === 'initialized') {
				let conversation;

				try {
					conversation = await client.createConversation({ uniqueName: room });
				} catch (e) {
					if (e instanceof Error && e.message === 'Conflict') {
						try {
							conversation = await client.getConversationByUniqueName(room);
						} catch (e) {
							if (e instanceof Error && e.message === 'Forbidden') {
								reject(`No tienes acceso a este chat`);
							} else reject(e);
						}
					} else reject(e);
				}

				conversation?.join();

				resolve(conversation ?? null);
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
