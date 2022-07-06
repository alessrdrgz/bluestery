<script lang="ts">
	import RoomSelect from '../components/RoomSelect.svelte';
	import { logout, signIn } from '../services/user';
	import { user } from '../store/userStore';
</script>

<section class="h-full w-full bg-gray-800">
	{#if !$user}
		<button on:click={() => signIn({ provider: 'github' })}>Sign In with GitHub</button>
		<button on:click={() => signIn({ provider: 'google' })}>Sign In with Google</button>
	{:else}
		<img src={$user.avatar_url} alt={$user.username} class="w-8 h-8 rounded-3xl" />
		<h1>Welcome {$user.username}</h1>
		<button on:click={logout}>Logout</button>
		<RoomSelect />
	{/if}
</section>
