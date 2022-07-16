<script lang="ts">
	import { user } from '$store/userStore';
	import { getAccessToken, acceptInvitation } from '$services/user';
	import { page } from '$app/stores';

	async function checkInvitation() {
		return new Promise<{ error?: boolean; message: string }>(async (resolve) => {
			if ($user && $user?.token !== null) {
				const sidToken = $page.url.searchParams.get('token');
				if (sidToken) {
					const accessToken = await getAccessToken({ token: $user.token });
					if (accessToken) {
						const res = await acceptInvitation({ sidToken, accessToken, user: $user });
						resolve({ message: res.message });
					} else resolve({ error: true, message: `Error al obtener el token de acceso` });
				} else resolve({ error: true, message: 'Enlace de invitación inválido' });
			} else resolve({ error: true, message: `Debe iniciar sesión primero` });
		});
	}

	const invitationPromise = checkInvitation();
</script>

{#await invitationPromise then res}
	<div class={`mx-auto`}>
		<h1 class={`text-xl${res.error && 'text-red-500'}`}>{res.message}</h1>
	</div>
{/await}
