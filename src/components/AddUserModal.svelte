<script lang="ts">
	import { Conversation } from '@twilio/conversations';

	import { addUserToConversation } from '../services/chat';

	import { activeConversation } from '../store/conversationStore';
	let username = '';
</script>

<div class="h-32 w-fit m-auto">
	<input placeholder="Nombre de usuario" name="username" bind:value={username} />
	<ul class="grid grid-cols-2">
		<li>
			<button>Cancelar</button>
		</li>
		<li>
			{#if $activeConversation !== null}
				<button
					on:click={() => addUserToConversation({ conversation: $activeConversation, username })}
					>Añadir</button
				>
			{/if}
		</li>
	</ul>
</div>
