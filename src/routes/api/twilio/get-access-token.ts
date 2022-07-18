import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$services/supabase';
import twilio from 'twilio';

const {
	VITE_PUBLIC_TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID,
	VITE_PUBLIC_TWILIO_API_KEY: TWILIO_API_KEY,
	VITE_PUBLIC_TWILIO_API_SECRET: TWILIO_API_SECRET,
	VITE_PUBLIC_TWILIO_SERVICE_SID: TWILIO_SERVICE_SID
} = import.meta.env;

export function generateAccessToken(identity: string): string {
	const { AccessToken } = twilio.jwt;
	const { ChatGrant } = AccessToken;

	const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, {
		identity
	});

	const conversationGrant = new ChatGrant({
		serviceSid: TWILIO_SERVICE_SID
	});

	accessToken.addGrant(conversationGrant);

	return accessToken.toJwt();
}

export const GET: RequestHandler = async ({ request }) => {
	const jwt = request.headers.get('jwt');
	if (!jwt) return { status: 401, body: 'JWT is not defined' };

	const user = await supabase.auth.api.getUser(jwt);
	const identity = user.data?.id;

	if (!identity) return { status: 401, body: 'User has no username defined' };

	const accessToken = await generateAccessToken(identity);

	return {
		status: 200,
		body: {
			accessToken
		}
	};
};
