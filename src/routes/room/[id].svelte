<script lang="ts">
	import Conversation from '../../components/conversation/Conversation.svelte';
	import { Conversation as ConversationType } from '@twilio/conversations';
	import ConversationInput from '../../components/conversation/conversation-input/ConversationInput.svelte';
	import { activeConversation } from '../../store/conversationStore';
	import { onMount } from 'svelte';
	import { user } from '../../store/userStore';
	import { joinConversation } from '../../utils/handle-user-conversation';
	import { page } from '$app/stores';
	import Spinner from '../../components/Spinner.svelte';

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
		loading = false;
	});
</script>

{#key $user}
	{#if loading}
		<div class="flex items-center justify-center h-full w-full background">
			<Spinner dotClass="before:bg-white" />
		</div>
	{:else if $activeConversation !== null}
		<div class="max-w-6xl mx-auto py-2 relative h-full">
			<h2 class="text-3xl">{$activeConversation.uniqueName}</h2>
			<Conversation />
			<ConversationInput />
		</div>
	{:else if message}
		<h1>{message}</h1>
	{/if}
{/key}
