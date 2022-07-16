<script lang="ts">
	import { activeConversation } from '../../../store/conversationStore';
	import { EmojiButton } from '@joeattardi/emoji-button';
	import Modal, { bind } from 'svelte-simple-modal';
	import AddUserModal from './AddUserModal.svelte';
	import { writable } from 'svelte/store';

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

	const addUserModal = writable(null);
	const openAddUserModal = () => addUserModal.set(bind(AddUserModal, {}));
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
	class="flex px-4 py-1 h-[60px] bg-[#008E90] absolute bottom-0 right-0 left-0 z-30"
	id="input-container"
>
	<input
		class="p-3 flex-1 border-gray-700 border-2 rounded-xl"
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

	<Modal
		show={$addUserModal}
		styleContent={{ overflow: 'visible', padding: '20px' }}
		styleWindowWrap={{ width: '300px', margin: 'auto' }}
		closeButton={false}
	>
		<button on:click={openAddUserModal}>Add</button>
	</Modal>
</div>
