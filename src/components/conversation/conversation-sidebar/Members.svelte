<script lang="ts">
	import { activeConversationUsers, activeConversation } from '$store/conversationStore';
	export let toggle: boolean;
	import DeleteIcon from '@svicons/material-outlined/delete.svelte';
	import { user } from '$store/userStore';
	import SidebarMenuContainer from '$components/conversation/conversation-sidebar/SidebarMenuContainer.svelte';
	import type { UserProfile } from '$services/user';
	import { removeUserFromConversation } from '$services/chat';
	import UserAvatar from '$components/header/UserAvatar.svelte';

	const deleteUser = async ({ user }: { user: UserProfile }) => {
		if ($activeConversation !== null) {
			const res = await removeUserFromConversation({
				username: user.username,
				conversation: $activeConversation
			});
		}
	};
</script>

<SidebarMenuContainer {toggle}>
	<div class="p-6 w-full flex flex-col gap-5 pr-[60px]">
		<p class="text-2xl text-white text-center mb-2">Miembros del chat</p>

		<div class=" overflow-y-scroll flex flex-col gap-5">
			{#each $activeConversationUsers as converUser}
				{#if $user?.username !== converUser.username}
					<div
						class="flex items-center justify-start gap-2 border-black border p-2 rounded-md shadow-lg"
					>
						<UserAvatar url={converUser.avatar_url} class="w-8 h-8" />

						<p class="flex-1 text-white">{converUser.username}</p>

						{#if $activeConversation?.createdBy === $user?.id}
							<button
								class="h-6 w-6"
								on:click={async () => {
									await deleteUser({ user: converUser });
								}}
							>
								<DeleteIcon class="fill-white" />
							</button>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</SidebarMenuContainer>
