<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { activeConversation } from '../store/conversationStore';
	import type { Message as Msg } from '@twilio/conversations';
	import Message from './Message.svelte';
	let div: HTMLDivElement;
	let messages: Array<Msg> = [];
	let autoscroll = true;

	onMount(async () => {
		if ($activeConversation) {
			const paginator = await $activeConversation.getMessages();
			messages = paginator.items;
			$activeConversation.on('messageAdded', (message: Msg) => {
				messages = [...messages, message];
			});
		}
	});

	afterUpdate(() => {
		if (autoscroll) {
			div.scrollTo(0, div.scrollHeight);
		}
		autoscroll = true;
	});

	$activeConversation?.on('messageRemoved', async (message) => {
		autoscroll = false;
		messages = [...messages.filter((msg) => msg.sid !== message.sid)];
	});
</script>

<div bind:this={div} class="h-4/5 overflow-y-scroll overflow-x-hidden">
	<div class=" flex flex-col justify-end [&>div]:flex-grow-0 [&>div]:flex-shrink-0">
		{#key messages}
			{#each messages as message}
				<Message {message} />
			{/each}
		{/key}
	</div>
</div>
