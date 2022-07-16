import { createOrJoinConversation, getAllUsersFromConversation } from '$services/chat';
import { getAccessToken } from '$services/user';
import { activeConversation, activeConversationUsers } from '$store/conversationStore';
import { goto } from '$app/navigation';
import type { User } from '$store/userStore';
import { Conversation } from '@twilio/conversations';

export async function joinConversation(
	room: string,
	user: User
): Promise<void | { message: string; error: boolean }> {
	if (!user || user?.token == null) return { error: true, message: `Debe iniciar sesión primero` };
	const accessToken = await getAccessToken({ token: user.token });
	try {
		const conversation = await createOrJoinConversation({
			room: room.toLowerCase(),
			accessToken
		});

		if (conversation instanceof Conversation) {
			activeConversation.set(conversation);
			activeConversationUsers.set(await getAllUsersFromConversation({ conversation }));
			goto(`/room/${room.toLowerCase()}`);
		} else return { error: true, message: conversation?.message ?? `No se pudo crear el chat` };
	} catch (e) {
		if (e instanceof Error) return { error: true, message: e.message };
		else return { error: true, message: e as string };
	}
}
