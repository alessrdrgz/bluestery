<script lang="ts">
	import Conversation from '../../components/Conversation.svelte';
	import ConversationInput from '../../components/ConversationInput.svelte';
	import { activeConversation } from '../../store/conversationStore';
</script>

{#if $activeConversation}
	<div class="max-w-6xl mx-auto py-2 relative h-full">
		<h2 class="text-3xl">{$activeConversation.uniqueName}</h2>
		<Conversation />
		<ConversationInput />
	</div>
{/if}
