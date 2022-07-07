<script lang="ts">
	import { user } from '../store/userStore';
	import type { Message } from '@twilio/conversations';
	import UserAvatar from './UserAvatar.svelte';
	import { stringToColor } from '../utils/string-to-color';
	import { activeConversationUsers } from '../store/conversationStore';
	import { formatDate } from '../utils/date-format';
	import MessageMenu from './ContextMenu/MessageMenu.svelte';

	export let message: Message;

	const { body, author, dateCreated } = message;
	let local = message.author === $user?.username;

	const userProfile = $activeConversationUsers.find((user) => user.username === author);
	const accentColor = userProfile?.accent_color ?? stringToColor({ str: userProfile?.id ?? '' });

	let showMenu = false;
	let pos = { x: 0, y: 0 };

	async function handleOpenMenu(e: MouseEvent) {
		e.preventDefault();
		if (showMenu) {
			showMenu = false;
			await new Promise((res) => setTimeout(res, 100));
		}

		pos = { x: e.clientX, y: e.clientY };
		showMenu = true;
	}
</script>

<div
	id="message-body"
	class={`flex items-start mt-14 w-4/5 ${
		local ? 'justify-end mr-4 ml-auto' : 'ml-4 mr-auto'
	} relative `}
	on:contextmenu={handleOpenMenu}
>
	{#if !local}
		<UserAvatar avatar={userProfile?.avatar_url ?? ''} />
	{/if}
	<div
		id="message-box"
		class={`flex-initial relative inline-block py-2 px-4 mx-4 rounded-lg shadow-md min-h-[2.5rem] tail ${
			local ? 'tail-right' : 'tail-left'
		}`}
		style={`background-color: ${accentColor}; --accent-color: ${accentColor}`}
	>
		<span
			id="meta"
			class={`align-top absolute bottom-full ${
				local ? 'right-0 -mr-1 rotate-3' : 'left-0 -ml-1 -rotate-3'
			} text-xs whitespace-nowrap text-ellipsis text-white py-1 px-3 -mb-1 z-10`}
		>
			<span id="name" class={`${local ? 'mr-1' : 'ml-1'} relative z-10`}>{author}</span>
			<i
				id="meta-bg"
				class={`h-full w-full absolute top-0 left-0 block ${
					local ? 'border-r-4' : 'border-l-4'
				} bg-black bg-opacity-80 -skew-x-12`}
				style={`border-color: ${accentColor}`}
			/>
		</span>

		<span id="message" class="break-all">{body}</span>

		<span class="basis-full h-0" />
	</div>
	{#if local}
		<UserAvatar avatar={userProfile?.avatar_url ?? ''} />
	{/if}

	{#if dateCreated}
		<span class={`text-xs text-gray-500 absolute -bottom-5 ${local ? 'right-20' : 'left-20'}`}
			>{formatDate({ date: dateCreated })}</span
		>
	{/if}
</div>

<MessageMenu {...pos} {showMenu} {message} />

<style>
	.tail:after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		top: 30px;
		border: 20px solid transparent;
		border-top: 0;
		margin-top: -20px;
	}

	.tail-right:after {
		right: 0;
		border-left-color: var(--accent-color);
		border-right: 0;
		border-top-right-radius: 4px;
		margin-right: -14px;
	}

	.tail-left:after {
		left: 0;
		border-right-color: var(--accent-color);
		border-left: 0;
		border-top-left-radius: 4px;
		margin-left: -12px;
	}
</style>
