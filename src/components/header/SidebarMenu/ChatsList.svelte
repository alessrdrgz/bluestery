<script lang="ts">
	import { Motion } from 'svelte-motion';
	import type { Writable } from 'svelte/store';
	import ReturnIcon from '@svicons/material-outlined/arrow-back.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { user } from '$store/userStore';
	import { getUserConversations } from '$services/user';
	import type { UserConversations } from '$routes/api/twilio/get-conversations';
	import ConversationCard from '$components/header/SidebarMenu/ConversationCard.svelte';
	import Spinner from '$components/Spinner.svelte';

	export let toggler: Writable<boolean> & { next: (index?: number) => void };
	export let toggle: boolean;
	let conversationsNames: UserConversations[] = [];
	let loading = true;

	const updateConversations = async () => {
		if ($user !== null) {
			const { conversations, message, error } = await getUserConversations({ user: $user });

			if (!error) {
				conversationsNames = [...conversations];
			}
		}
	};

	afterUpdate(updateConversations);
	onMount(async () => {
		await updateConversations();
		loading = false;
	});
</script>

<Motion
	let:motion
	animate={$toggler && toggle ? 'open' : 'closed'}
	variants={{ open: { width: '300px' }, closed: { width: '0' } }}
>
	<div
		use:motion
		class="absolute bg-[#2c73d0] top-[60px] bottom-0 right-0 h-[calc(100vh-60px)] overflow-x-hidden"
	>
		<div class="p-4 mt-4 h-full">
			<div class="flex items-center">
				<button on:click={() => toggler.next()}>
					<ReturnIcon class="w-8 h-8 fill-white" />
				</button>
				<h1 class="text-white text-xl font-semibold ml-4">Listado de chats</h1>
			</div>
			{#if loading}
				<div class="h-full flex justify-center items-center w-full overflow-y-hidden">
					<Spinner dotClass="before:bg-white" />
				</div>
			{:else}
				<div>
					{#each conversationsNames as conversation}
						<ConversationCard
							name={conversation.name}
							author={conversation.author}
							lastMessage={conversation.last_message}
							unreadMessages={conversation.unread_messages}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</Motion>
