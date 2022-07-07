<script lang="ts">
	import { activeConversation } from '../store/conversationStore';
	import { EmojiButton } from '@joeattardi/emoji-button';

	let message = '';

	let emojiButton: HTMLElement;
	const emojiPicker = new EmojiButton();

	emojiPicker.on('emoji', ({ emoji }) => {
		message += emoji;
	});

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && message !== '') {
			$activeConversation?.sendMessage(message);
			message = '';
		}
	};
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="mt-5 flex px-4" id="input-container">
	<input
		class="p-2 flex-1 border-gray-700 border-2 rounded-xl"
		type="text"
		bind:value={message}
		placeholder="Escribe tu mensaje aquí"
	/>
	<button
		bind:this={emojiButton}
		on:click={() => emojiPicker.togglePicker(emojiButton)}
		class="ml-2"
		id="emoji-picker">😄</button
	>
</div>
