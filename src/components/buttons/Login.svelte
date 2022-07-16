<script lang="ts">
	import { signIn } from '$services/user';
	import GithubIcon from '$components/icons/GitHub.svelte';
	import GoogleIcon from '$components/icons/Google.svelte';

	export let type: 'github' | 'google';

	const types = {
		github: {
			icon: GithubIcon,
			styles: 'bg-gray-400 hover:bg-gray-500',
			text: 'Iniciar sesión con Github'
		},

		google: {
			icon: GoogleIcon,
			styles: 'bg-red-500 hover:bg-red-700',
			text: 'Iniciar sesión con Google'
		}
	};
</script>

<button
	on:click={() => signIn({ provider: type })}
	class={`rounded-lg text-white px-4 py-2 flex items-center text-sm font-semibold transition-colors ease-in-out shadow-lg ${types[type].styles}`}
>
	<svelte:component this={types[type].icon} class="w-6 h-6 mr-2 fill-white" />
	{types[type].text}</button
>
