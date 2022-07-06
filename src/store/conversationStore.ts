import type { Conversation } from '@twilio/conversations';
import { writable } from 'svelte/store';

export const activeConversation = writable<Conversation | null>(null);
