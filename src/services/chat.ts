import { Client, Conversation } from '@twilio/conversations';

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
