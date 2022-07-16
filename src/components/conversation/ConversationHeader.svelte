<script lang="ts">
	import { activeConversation, activeConversationUsers } from '$store/conversationStore';
	let usernames: string[] = $activeConversationUsers.map((user) => user.username);
	import MenuToggle from '$components/conversation/MenuToggle.svelte';
	import { Motion, useCycle } from 'svelte-motion';
	import MembersMenu from '$components/conversation/conversation-sidebar/Members.svelte';
	import GroupIcon from '@svicons/material-outlined/group.svelte';
	import { afterUpdate } from 'svelte';

	const sidebarToggle = useCycle(false, true);
	const membersToggle = useCycle(false, true);

	afterUpdate(() => {
		usernames = $activeConversationUsers.map((user) => user.username);
	});
</script>

<Motion let:motion animate={$sidebarToggle ? 'open' : 'closed'}>
	<div class="h-[60px] bg-[#008E90] px-4 flex relative w-full">
		<div>
			<h1 class="text-white text-2xl font-semibold">{$activeConversation?.uniqueName}</h1>
			<p class="text-gray-600 text-xs mt-2">
				{usernames.splice(0, 3).join(', ')}
				{#if usernames.length > 0}
					{` y ${usernames.length} más...`}
				{/if}
			</p>
		</div>

		<MenuToggle
			toggle={sidebarToggle.next}
			class="w-8 h-8 absolute right-3 top-3 stroke-white z-10"
		/>

		<Motion
			let:motion
			initial={{ width: '0px' }}
			variants={{ open: { width: '60px' }, closed: { width: '0px' } }}
		>
			<div
				use:motion
				class="h-[calc(100vh-60px)] absolute top-[60px] bottom-0 right-0 bg-[#008e90] text-center [&>button]:mt-4 overflow-y-scroll [&>button>svg]:fill-white [&>button]:w-8 [&>button]:h-8 [&>button]:mx-auto z-50 border-t border-gray-300"
			>
				<button
					on:click={() => {
						membersToggle.next();
					}}><GroupIcon /></button
				>
			</div>
		</Motion>
	</div>
</Motion>

<MembersMenu toggle={$membersToggle && $sidebarToggle} />
