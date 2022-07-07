<script lang="ts">
	import Menu from './Menu.svelte';
	import MenuOption from './MenuOption.svelte';
	import MenuDivider from './MenuDivider.svelte';
	import type { Message } from '@twilio/conversations';
	import { copyToClipboard } from '../../utils/copy-to-clipboard';
	import CopyIcon from '@svicons/material-outlined/content-copy.svelte';

	export let x: number;
	export let y: number;
	export let showMenu = false;
	export let message: Message;

	const { body } = message;
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
	</Menu>
{/if}
