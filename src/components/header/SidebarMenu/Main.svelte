<script lang="ts">
	import { Motion } from 'svelte-motion';
	import CloseIcon from '@svicons/material-outlined/close.svelte';
	import LogoutIcon from '@svicons/material-outlined/logout.svelte';
	import ChatsListIcon from '@svicons/material-outlined/question-answer.svelte';
	import { logout } from '$services/user';
	import { user } from '$store/userStore';
	import UserAvatar from '$components/header/UserAvatar.svelte';
	import type { Writable } from 'svelte/store';

	export let toggler: Writable<boolean> & { next: (index?: number) => void };
</script>

<Motion
	let:motion
	animate={$toggler && $user !== null ? 'open' : 'closed'}
	variants={{ open: { width: '300px' }, closed: { width: '0' } }}
>
	<div use:motion class="absolute bg-[#2c73d0] top-0 bottom-0 right-0 h-screen overflow-x-hidden">
		<div
			class="absolute top-0 right-0 w-full border-l border-t border-l-white h-[60px] bg-transparent"
		/>

		<button class="absolute right-2 top-2" on:click={() => toggler.next()}>
			<CloseIcon class="w-4 h-4 fill-white" />
		</button>
		<div class="p-8 flex items-center justify-center flex-col overflow-hidden">
			<UserAvatar url={$user?.avatar_url} circle class="w-32 h-32" />
			<p class="text-white text-2xl">{$user?.username}</p>

			<div
				class="h-fit w-full mt-4 flex flex-col items-start [&>button]:text-white [&>button]:w-full [&>button]:p-2 [&>button]:text-lg [&>button]:flex [&>button]:items-center [&>button>svg]:mr-3 [&>button>svg]:w-6 [&>button>svg]:h-6"
			>
				<button class="hover:border-r border-white transition-all ease-in-out" on:click={logout}>
					<LogoutIcon />
					Cerrar sesión
				</button>
			</div>
		</div>
	</div>
</Motion>
