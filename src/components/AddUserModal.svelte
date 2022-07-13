<script lang="ts">
	import { getAllUsers } from '../services/user';
	import { addUserToConversation } from '../services/chat';
	import { activeConversation } from '../store/conversationStore';
	import PrimaryButton from './buttons/Primary.svelte';
	import RedButton from './buttons/Red.svelte';
	import AutoComplete from './AutoCompleteInput.svelte';

	let selectedUser: string;
	let responseMessage: string;
	let responseError: boolean = false;
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
		{/if}
	</div>
{/await}
