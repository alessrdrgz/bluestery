<script lang="ts">
	import Conversation from '../../components/conversation/Conversation.svelte';
	import { Conversation as ConversationType } from '@twilio/conversations';
	import ConversationInput from '../../components/conversation/conversation-input/ConversationInput.svelte';
	import { activeConversation, activeConversationUsers } from '../../store/conversationStore';
	import { onMount } from 'svelte';
	import { user } from '../../store/userStore';
	import { joinConversation } from '../../utils/handle-user-conversation';
	import { page } from '$app/stores';
	import Spinner from '../../components/Spinner.svelte';
	import ConversationHeader from '../../components/conversation/ConversationHeader.svelte';
	import { supabase } from '../../services/supabase';
	import type { UserProfile } from '../../services/user';

	let message: string = '';
	let loading = true;

	onMount(async () => {
		if (
			($activeConversation === null || $activeConversation.uniqueName !== $page.params.id) &&
			$user
		) {
			const res = await joinConversation($page.params.id, $user);

			if (typeof res === 'object' && !(res instanceof ConversationType)) {
				message = res.message;
			}
		} else if (!$user) message = 'Debe iniciar sesión antes...';

		$activeConversation?.on('participantJoined', async (participant) => {
			const user = await supabase
				.from<UserProfile>('profiles')
				.select()
				.filter('id', 'eq', participant.identity);

			if (user.data && user.data.length > 0) {
				$activeConversationUsers = [...$activeConversationUsers, user.data[0]];
			}
		});

		$activeConversation?.on('participantLeft', async (participant) => {
			const user = await supabase
				.from<UserProfile>('profiles')
				.select()
				.filter('id', 'eq', participant.identity);

			if (user.data && user.data.length > 0) {
				$activeConversationUsers = [
					...$activeConversationUsers.filter((u) => u.id !== user.data[0].id)
				];
			}
		});

		loading = false;
	});
</script>

{#key $user}
	{#if loading}
		<div class="flex items-center justify-center h-full w-full background">
			<Spinner dotClass="before:bg-white" />
		</div>
	{:else if $activeConversation !== null}
		<div class="w-full relative h-full">
			<ConversationHeader />
			<Conversation />
			<ConversationInput />
		</div>
	{:else if message}
		<h1>{message}</h1>
	{/if}
{/key}
