<script lang="ts">
	import { getAllUsers } from '../services/user';
	import { addUserToConversation } from '../services/chat';
	import { activeConversation } from '../store/conversationStore';
	import PrimaryButton from './buttons/Primary.svelte';
	import AutoComplete from './AutoCompleteInput.svelte';

	let selectedUser: string;
	let responseMessage: string;
	let responseError: boolean = false;
	const userPromise = getAllUsers();

	const handleAddUser = async () => {
		if ($activeConversation && selectedUser) {
			console.log(selectedUser);
			const { message, error } = await addUserToConversation({
				conversation: $activeConversation,
				username: selectedUser
			});

			responseMessage = message;
			responseError = error ?? false;
			console.log({ message, error });
		}
	};
</script>

{#await userPromise then users}
	<div class="h-fit w-fit m-auto flex items-center flex-col mb-16">
		<AutoComplete
			data={users}
			placeholder="Nombre de usuario"
			objectType
			objectKey="username"
			bind:inputValue={selectedUser}
		/>
	</div>
	<div class="text-center">
		<p class={`${responseError && 'text-red'} text-center mb-3`}>
			{responseMessage || ' '}
		</p>
		{#if $activeConversation !== null}
			<PrimaryButton on:click={handleAddUser} disabled={selectedUser}>Añadir</PrimaryButton>
		{/if}
	</div>
{/await}
