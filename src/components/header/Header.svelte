<script>
	import UserAvatar from '$components/header/UserAvatar.svelte';
	import { user } from '$store/userStore';
	import { useCycle } from 'svelte-motion';
	import SidebarMainMenu from '$components/header/SidebarMenu/Main.svelte';
	import CloseIcon from '@svicons/material-outlined/close.svelte';

	const mainMenuToggler = useCycle(false, true);
</script>

<div class="h-[60px] bg-[#2c73d0] w-full border-b border-gray-300 flex items-center">
	<a href="/"><h1 class="text-white text-2xl ml-4">Bluestery</h1></a>
	{#if $user !== null}
		{#if $mainMenuToggler}
			<button on:click={() => mainMenuToggler.next()}>
				<CloseIcon class="fill-white w-10 h-10 absolute top-3 right-3 cursor-pointer" />
			</button>
		{:else}
			<UserAvatar
				url={$user?.avatar_url}
				circle
				class="absolute top-3 right-3 w-10 h-10 cursor-pointer"
				on:click={() => mainMenuToggler.next()}
			/>
		{/if}
	{/if}
</div>

<SidebarMainMenu toggler={mainMenuToggler} />
