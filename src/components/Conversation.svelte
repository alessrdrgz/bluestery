<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { activeConversation } from '../store/conversationStore';
	import type { Message as Msg } from '@twilio/conversations';
	import { user } from '../store/userStore';
	import Message from './Message.svelte';
	let div: HTMLDivElement;
	let messages: Array<Msg> = [];
	let autoscroll = true;

	onMount(async () => {
		if ($activeConversation) {
			const paginator = await $activeConversation.getMessages();
			messages = paginator.items;
			$activeConversation.on('messageAdded', (message: Msg) => {
				if (message.author === $user?.id) autoscroll = true;
				messages = [...messages, message];
			});

			$activeConversation?.on('messageRemoved', async (message) => {
				messages = [...messages.filter((msg) => msg.sid !== message.sid)];
			});

			$activeConversation?.on('messageUpdated', async ({ message }) => {
				messages = [...messages.map((msg) => (msg.sid === message.sid ? message : msg))];
			});
		}
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	const handleUserScroll = () => {
		const { scrollTop, scrollHeight, clientHeight } = div;
		autoscroll = Math.round(scrollHeight - scrollTop) === clientHeight;
	};
</script>

{#key $activeConversation}
	<div
		bind:this={div}
		class="h-4/5 md:overflow-y-hidden md:hover:overflow-y-auto overflow-x-hidden hover:-mr-[2.5px]"
		on:scroll={handleUserScroll}
	>
		<div class=" flex flex-col justify-end [&>div]:flex-grow-0 [&>div]:flex-shrink-0">
			{#key messages}
				{#each messages as message}
					<Message {message} />
				{/each}
			{/key}
		</div>
	</div>
{/key}
