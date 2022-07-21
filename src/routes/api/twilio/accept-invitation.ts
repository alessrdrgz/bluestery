import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { supabase } from '$services/supabase';
import { Client } from '@twilio/conversations';
import twilio from 'twilio';
const { VITE_PUBLIC_JWT_SECRET: JWT_SECRET } = import.meta.env;

declare module 'jsonwebtoken' {
	export interface ConversationSIDJwtPayload extends jwt.JwtPayload {
		sid: string;
	}
}

const {
	VITE_PUBLIC_TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID,
	VITE_PUBLIC_TWILIO_AUTH_TOKEN: TWILIO_AUTH_TOKEN
} = import.meta.env;

export const GET: RequestHandler = async ({ request }) => {
	const jwToken = request.headers.get('jwt');
	if (!jwToken) return { status: 401, body: { message: 'Debe iniciar sesión primero' } };

	const sidToken = request.headers.get('sidToken');
	if (!sidToken) return { status: 422, body: { message: 'Enlace inválido' } };

	const user = await supabase.auth.api.getUser(jwToken);
	if (!user) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	const accessToken = request.headers.get('accessToken');
	if (!accessToken) return { status: 401, body: { message: 'Access Token is not defined' } };

	const identity = user.data?.id;
	if (!identity)
		return {
			status: 401,
			body: { message: 'Tienes que iniciar sesión para utilizar este enlace' }
		};

	const { sid } = <jwt.ConversationSIDJwtPayload>jwt.verify(sidToken, JWT_SECRET);
	const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
	const conversationCtx = client.conversations.v1.conversations(sid);

	if (!conversationCtx)
		return { status: 404, body: { message: `Conversación con SID ${sid} no encontrada` } };

	await conversationCtx.participants.create({ identity });
	const conversation = await conversationCtx.fetch();
	return { status: 200, headers: { Location: `/room/${conversation.uniqueName}` } };
};
