<script lang="ts">
	import { getAllUsers } from '../services/user';
	import { addUserToConversation } from '../services/chat';
	import { activeConversation } from '../store/conversationStore';
	import PrimaryButton from './buttons/Primary.svelte';
	import RedButton from './buttons/Red.svelte';
	import AutoComplete from './AutoCompleteInput.svelte';
	import { generateConversationInviteUrl } from '../services/chat';
	import { user } from '../store/userStore';
	import { copyToClipboard } from '../utils/copy-to-clipboard';

	let selectedUser: string;
	let responseMessage: string;
	let responseError: boolean = false;
	let clipboardMessageEl: HTMLSpanElement;

	const userPromise = getAllUsers();

	const handleAddUser = async () => {
		if ($activeConversation && selectedUser) {
			const { message, error } = await addUserToConversation({
				conversation: $activeConversation,
				username: selectedUser
			});

			responseMessage = message;
			responseError = error || false;
		}
	};

	const generateUrl = async () => {
		if ($user?.token && $activeConversation?.sid) {
			const { message, error, url } = await generateConversationInviteUrl({
				token: $user.token,
				sid: $activeConversation.sid
			});

			if (error || message) {
				console.log({ error, message });
			} else {
				copyToClipboard(url);
				clipboardMessageEl.classList.remove('hidden');
				setTimeout(() => {
					clipboardMessageEl.classList.add('hidden');
				}, 2000);
			}
		}
	};

	const handleCloseModal = (e: MouseEvent) => {
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
	};
</script>

{#await userPromise then users}
	<h1 class="text-center mb-3 font-black text-lg">Añadir un usuario</h1>
	{#if responseMessage}
		<p
			class={`${
				responseError ? 'text-red-500' : 'text-gray-500'
			} text-xs font-medium text-center mb-2`}
		>
			{responseMessage}
		</p>
	{/if}
	<div class={`m-auto flex items-center flex-col mb-14${!responseError && 'mt-8'}`}>
		<AutoComplete
			data={users}
			placeholder="Nombre de usuario"
			objectType
			objectKey="username"
			bind:inputValue={selectedUser}
		/>
	</div>
	<div class="text-center pt-16">
		{#if $activeConversation !== null}
			<ul class="grid grid-cols-2">
				<li>
					<RedButton on:click={handleCloseModal}>Cancelar</RedButton>
				</li>
				<li>
					<PrimaryButton on:click={handleAddUser} disabled={selectedUser}>Añadir</PrimaryButton>
				</li>
			</ul>

			<div class="border-2 border-gray-400 rounded-lg w-4/5 h-0 mx-auto m-5" />

			<div class="mx-auto relative">
				<PrimaryButton on:click={generateUrl}>Generar enlace</PrimaryButton>
				<span class="text-gray-400 text-center block"
					>El enlace solo es válido durante 15 minutos</span
				>
				<span
					class="absolute -bottom-16 right-0 w-full bg-black bg-opacity-40 text-white rounded-lg hidden"
					bind:this={clipboardMessageEl}>Enlace copiado</span
				>
			</div>
		{/if}
	</div>
{/await}
