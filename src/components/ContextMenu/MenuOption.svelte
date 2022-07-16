<script lang="ts">
	import { getContext } from 'svelte';
	import { key } from '$utils/menu';
	import { createEventDispatcher } from 'svelte';

	export let isDisabled = false;
	export let text = '';

	const dispatch = createEventDispatcher();
	const { dispatchClick } = getContext(key);

	function handleClick(e: MouseEvent) {
		if (isDisabled) return;
		dispatch('click');
		dispatchClick();
	}
</script>

<div
	class={`py-1 px-3 flex items-center gap-1 text-xs min-w-[100px] select-none rounded-md ${
		isDisabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer'
	}`}
	on:click={handleClick}
>
	{#if text}
		{text}
	{:else}
		<slot />
	{/if}
</div>
