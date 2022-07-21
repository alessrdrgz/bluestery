<script lang="ts">
	import { user } from '$store/userStore';
	import { getAccessToken, acceptInvitation } from '$services/user';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Spinner from '$components/Spinner.svelte';
	let loading = true;

	async function checkInvitation() {
		return new Promise<{ error?: boolean; message: string } | void>(async (resolve) => {
			if ($user && $user?.token !== null) {
				const sidToken = $page.url.searchParams.get('token');
				if (sidToken) {
					const accessToken = await getAccessToken({ token: $user.token });
					if (accessToken) {
						const { location } = await acceptInvitation({ sidToken, accessToken, user: $user });
						if (!location) resolve({ message: 'Error inesperado', error: true });
						goto(location);
						resolve({ message: 'OK' });
					} else resolve({ error: true, message: `Error al obtener el token de acceso` });
				} else resolve({ error: true, message: 'Enlace de invitación inválido' });
			} else resolve({ error: true, message: `Debe iniciar sesión primero` });
			loading = false;
		});
	}

	const invitationPromise = checkInvitation();
</script>

{#if loading}
	<Spinner />
{:else}
	{#await invitationPromise then res}
		{#if typeof res === 'object' && res.message}
			<div class={`mx-auto`}>
				<h1 class={`text-xl${res.error && 'text-red-500'}`}>{res.message}</h1>
			</div>
		{/if}
	{/await}
{/if}
