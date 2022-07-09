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
			.filter('username', 'eq', user.identity);
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
}) {
	const user = await supabase
		.from<UserProfile>('profiles')
		.select()
		.filter('username', 'eq', username);
	if (user.data && user.data.length > 0) {
		try {
			const res = await conversation.add(username);
			return { message: `User ${username} added to conversation` };
		} catch (e) {
			if (e instanceof Error) {
				if (e.message === 'Conflict') {
					return { message: `User ${username} already in conversation`, error: true };
				} else return { message: e.message, error: true };
			} else return { message: e, error: true };
		}
	} else return { message: `User ${username} not found`, error: true };
}
