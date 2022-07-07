import type { Conversation } from '@twilio/conversations';
import type { UserProfile } from '../services/user';
import { writable } from 'svelte/store';

export const activeConversation = writable<Conversation | null>(null);
export const activeConversationUsers = writable<Array<UserProfile>>([]);
