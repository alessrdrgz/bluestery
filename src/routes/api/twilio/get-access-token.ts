import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '../../../services/supabase';
import twilio from 'twilio';

const {
	VITE_PUBLIC_TWILIO_ACCOUNT_SID: TWILIO_ACCOUNT_SID,
	VITE_PUBLIC_TWILIO_API_KEY: TWILIO_API_KEY,
	VITE_PUBLIC_TWILIO_API_SECRET: TWILIO_API_SECRET,
	VITE_PUBLIC_TWILIO_SERVICE_SID: TWILIO_SERVICE_SID
} = import.meta.env;

export const get: RequestHandler = async ({ request }) => {
	const jwt = request.headers.get('jwt');
	if (!jwt) return { status: 401 };

	const user = await supabase.auth.api.getUser(jwt);
	const identity = user.data?.user_metadata.user_name;

	if (!identity) return { status: 401 };

	const { AccessToken } = twilio.jwt;
	const { ChatGrant } = AccessToken;

	const accessToken = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, {
		identity
	});

	const conversationGrant = new ChatGrant({
		serviceSid: TWILIO_SERVICE_SID
	});

	accessToken.addGrant(conversationGrant);

	return {
		status: 200,
		body: {
			accessToken: accessToken.toJwt()
		}
	};
};
