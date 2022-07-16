import type { RequestHandler } from '@sveltejs/kit';
import * as JWT from 'jsonwebtoken';
import { supabase } from '$services/supabase';
import { Client } from '@twilio/conversations';
const { VITE_PUBLIC_JWT_SECRET: JWT_SECRET } = import.meta.env;

declare module 'jsonwebtoken' {
	export interface ConversationSIDJwtPayload extends JWT.JwtPayload {
		sid: string;
	}
}
export const get: RequestHandler = async ({ request }) => {
	const jwt = request.headers.get('jwt');
	if (!jwt) return { status: 401, body: { message: 'Debe iniciar sesión primero' } };

	const sidToken = request.headers.get('sidToken');
	if (!sidToken) return { status: 422, body: { message: 'Enlace inválido' } };

	const user = await supabase.auth.api.getUser(jwt);
	if (!user) return { status: 401, body: { message: 'No se ha encontrado el usuario' } };

	const accessToken = request.headers.get('accessToken');
	if (!accessToken) return { status: 401, body: { message: 'Access Token is not defined' } };

	const identity = user.data?.id;
	if (!identity)
		return {
			status: 401,
			body: { message: 'Tienes que iniciar sesión para utilizar este enlace' }
		};

	try {
		const { sid } = <JWT.ConversationSIDJwtPayload>JWT.verify(sidToken, JWT_SECRET);
		const client = new Client(accessToken);
		const conversation = await client.getConversationBySid(sid);

		if (!conversation)
			return { status: 404, body: { message: `Conversación con SID ${sid} no encontrada` } };
		return conversation
			.add(identity)
			.then(() => {
				return { status: 200, headers: { Location: `/room/${conversation.uniqueName}` } };
			})
			.catch((err) => {
				console.error(err.body);
				if (err.body.message === 'Participant already exists')
					return { status: 304, headers: { Location: `/room/${conversation.uniqueName}` } };
				return { status: 500, body: { message: 'Error al añadir usuario a la conversación' } };
			});
	} catch (e) {
		if (e instanceof JWT.TokenExpiredError)
			return { status: 401, body: { message: 'El enlace ha expirado' } };

		if (typeof e === 'object' && e !== null)
			return { status: 401, body: { message: e.toString() } };

		return { status: 400, body: { message: `Error inesperado: ${e}` } };
	}
};
