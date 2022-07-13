<script lang="ts">
	import { user } from '../store/userStore';
	import { joinConversation } from '../utils/handle-user-conversation';

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

<div class="flex flex-col max-w-md mx-auto mt-10">
	<form on:submit|preventDefault={handleSubmit}>
		<label for="room-select" class="block mb-2 text-mdº font-medium text-gray-700">
			Introduce el código de la sala a la que quieres entrar
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
		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mt-2"
		>
			¡Entrar!</button
		>
	</form>
</div>
