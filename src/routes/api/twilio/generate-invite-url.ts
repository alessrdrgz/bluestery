import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$services/supabase';
import { Client } from '@twilio/conversations';
import { generateAccessToken } from '$/routes/api/twilio/get-access-token';
import * as JWT from 'jsonwebtoken';

const { VITE_PUBLIC_JWT_SECRET: JWT_SECRET, VITE_PUBLIC_DOMAIN: DOMAIN } = import.meta.env;

if (!JWT_SECRET) throw new Error('JWT env secret is not set');
if (!DOMAIN) throw new Error('Domain env is not set');

export const GET: RequestHandler = async ({ request }) => {
	const jwt = request.headers.get('jwt');
	if (!jwt) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	const sid = request.headers.get('sid');
	if (!sid) return { status: 422, body: { message: 'No se ha encontrado la sala' } };

	const user = await supabase.auth.api.getUser(jwt);
	if (!user) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	if (user.data?.id) {
		const accessToken = generateAccessToken(user.data?.id);
		const client = new Client(accessToken);
		const conversation = await client.getConversationBySid(sid);
		const conversationUser = await conversation.getParticipantByIdentity(user.data?.id);

		if (conversation) {
			if (conversationUser?.roleSid === 'RL18d041bac1f44010a8951b9347a0bc8f') {
				const jsonWebToken = JWT.sign({ sid }, JWT_SECRET, { expiresIn: '15m' });
				return {
					status: 200,
					body: {
						url: `${DOMAIN}room/invite?token=${jsonWebToken}`
					}
				};
			} else
				return {
					status: 401,
					body: { message: 'Debes ser el admin de la conversación para generar una invitación' }
				};
		} else return { status: 404, body: { message: `Conversation with sid ${sid} not found` } };
	} else return { status: 401 };
};
