<script lang="ts">
	import Menu from './Menu.svelte';
	import MenuOption from './MenuOption.svelte';
	import MenuDivider from './MenuDivider.svelte';
	import type { Message } from '@twilio/conversations';
	import { copyToClipboard } from '../../utils/copy-to-clipboard';
	import CopyIcon from '@svicons/material-outlined/content-copy.svelte';
	import { user } from '../../store/userStore';
	import { activeConversation } from '../../store/conversationStore';
	import DeleteIcon from '@svicons/material-outlined/delete.svelte';
	import EditIcon from '@svicons/material-outlined/edit.svelte';

	export let x: number;
	export let y: number;
	export let showMenu = false;
	export let message: Message;

	export let editting = false;

	const { body, author } = message;
	const closeMenu = () => (showMenu = false);
</script>

{#if showMenu}
	<Menu {x} {y} on:clickoutside={closeMenu} on:click={closeMenu}>
		<MenuOption
			on:click={() => {
				if (body) {
					copyToClipboard(body);
				}
			}}
		>
			<CopyIcon class="w-4 h-4" color="rgb(107, 114, 128)" />
			Copiar mensaje
		</MenuOption>
		<MenuOption
			on:click={() => {
				editting = !editting;
			}}
			isDisabled={author !== $user?.username}
		>
			<EditIcon class="w-4 h-4" color="rgb(107, 114, 128)" />
			Editar mensaje
		</MenuOption>
		<MenuDivider />
		<MenuOption
			on:click={async () => {
				await message.remove();
			}}
			isDisabled={author !== $user?.username && $activeConversation?.createdBy !== $user?.username}
		>
			<DeleteIcon class="w-4 h-4" color="rgb(107, 114, 128)" />
			Eliminar mensaje
		</MenuOption>
	</Menu>
{/if}
