<script lang="ts">
	import { user } from '$store/userStore';
	import { joinConversation } from '$utils/handle-user-conversation';
	import PrimaryButton from '$components/buttons/Primary.svelte';

	let room = '';
	let error = '';

	async function handleSubmit(e: SubmitEvent) {
		if ($user) {
			const res = await joinConversation(room, $user);
			if (typeof res === 'object' && res.error) {
				error = res.message;
			}
		}
	}
</script>

<div class="flex flex-col max-w-md mt-10 mx-auto">
	<form on:submit|preventDefault={handleSubmit}>
		<label for="room-select" class="block mb-2 text-mdº font-medium text-gray-700 text-center">
			Introduce el código del chat
		</label>
		<p class="text-red-500 text-xs font-medium text-center mb-2">{error}</p>
		<input
			id="room-select"
			bind:value={room}
			type="text"
			class={`block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 uppercase text-center text-2xl ${
				error === '' && 'mt-8'
			}`}
		/>
		<PrimaryButton type="submit" class="w-full mt-2">¡Acceder al chat!</PrimaryButton>
	</form>
</div>
