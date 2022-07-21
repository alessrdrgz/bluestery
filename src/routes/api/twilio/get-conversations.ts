import { supabase } from '$services/supabase';
import type { RequestHandler } from '@sveltejs/kit';
import { Client } from '@twilio/conversations';
import { generateAccessToken } from '$/routes/api/twilio/get-access-token';
import type { UserProfile } from '$services/user';

export type UserConversations = {
	name: string;
	last_message: string;
	author: string;
	unread_messages: number;
	creator: string;
};

export const GET: RequestHandler = async ({ request }) => {
	const jwToken = request.headers.get('jwt');
	if (!jwToken) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	const user = await supabase.auth.api.getUser(jwToken);
	if (!user) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	if (user.data?.id) {
		const accessToken = generateAccessToken(user.data?.id);
		const client = new Client(accessToken);
		const userConversations: UserConversations[] = [];

		const conversations = (await client.getSubscribedConversations()).items;

		for (const conversation of conversations) {
			const participant = await conversation.getParticipantByIdentity(user.data?.id);
			if (participant !== null) {
				const messages = (await conversation.getMessages()).items;
				if (messages.length > 0) {
					const lastMessage = messages[messages.length - 1];
					const unreadMessages = await conversation.getUnreadMessagesCount();

					const author = await supabase
						.from<UserProfile>('profiles')
						.select()
						.filter('id', 'eq', lastMessage.author);

					const creator = await supabase
						.from<UserProfile>('profiles')
						.select()
						.filter('id', 'eq', conversation.createdBy);

					if (conversation.uniqueName && author.data[0] && lastMessage.body && creator.data[0]) {
						userConversations.push({
							name: conversation.uniqueName,
							last_message: lastMessage.body,
							author: author.data[0].username,
							unread_messages: unreadMessages ?? 0,
							creator: creator.data[0].username
						});
					}
				}
			}
		}

		return { status: 200, body: { conversations: userConversations } };
	} else return { status: 401 };
};
