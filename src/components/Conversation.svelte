<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { activeConversation } from '../store/conversationStore';
	import type { Message as Msg } from '@twilio/conversations';
	import Message from './Message.svelte';
	let div: HTMLDivElement;
	let messages: Array<Msg> = [];

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
		div.scrollTo(0, div.scrollHeight);
	});
</script>

<div bind:this={div} class="h-4/5 overflow-y-scroll overflow-x-hidden">
	<div class=" flex flex-col justify-end [&>div]:flex-grow-0 [&>div]:flex-shrink-0">
		{#each messages as message}
			<Message {message} />
		{/each}
	</div>
</div>
