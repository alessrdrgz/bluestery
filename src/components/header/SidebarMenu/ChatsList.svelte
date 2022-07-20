<script lang="ts">
	import { Motion } from 'svelte-motion';
	import type { Writable } from 'svelte/store';
	import ReturnIcon from '@svicons/material-outlined/arrow-back.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { user } from '$store/userStore';
	import { getUserConversations } from '$services/user';
	import type { UserConversations } from '$routes/api/twilio/get-conversations';

	export let toggler: Writable<boolean> & { next: (index?: number) => void };
	export let toggle: boolean;
	let conversationsNames: UserConversations[] = [];

	afterUpdate(async () => {
		if ($user !== null) {
			const { conversations, message, error } = await getUserConversations({ user: $user });

			if (!error) {
				conversationsNames = [...conversations];
			}
		}
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
		<div class="p-4 mt-4">
			<div class="flex items-center">
				<button on:click={() => toggler.next()}>
					<ReturnIcon class="w-8 h-8 fill-white" />
				</button>
				<h1 class="text-white text-xl font-semibold ml-4">Listado de chats</h1>
			</div>
			<div>
				{#each conversationsNames as conversation}
					<a href={`/room/${conversation.name}`}>
						<div class="border border-white rounded-lg mt-4 p-2 shadow-md bg-[#2867bb] relative">
							<p class="text-white uppercase">{conversation.name}</p>
							<p class="text-gray-300 overflow-x-clip">
								{`${conversation.author}: ${conversation.last_message}`}
							</p>
							{#if conversation.unread_messages > 0}
								<span
									class="text-white bg-red-500 rounded-full p-1 absolute -top-3 -right-2 w-6 h-6 text-center flex items-center justify-center"
									>{conversation.unread_messages}
								</span>
							{/if}
						</div>
					</a>
				{/each}
				{#each conversationsNames as conversation}
					<a href={`/room/${conversation.name}`}>
						<div class="border border-white rounded-lg mt-4 p-2 shadow-md bg-[#2867bb] relative">
							<p class="text-white uppercase">{conversation.name}</p>
							<p class="text-gray-300 overflow-x-clip">
								{`${conversation.author}: ${conversation.last_message}`}
							</p>
							{#if conversation.unread_messages > 0}
								<span
									class="text-white bg-red-500 rounded-full p-1 absolute -top-3 -right-2 w-6 h-6 text-center flex items-center justify-center"
									>{conversation.unread_messages}
								</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</Motion>
