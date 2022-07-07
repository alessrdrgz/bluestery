<script lang="ts">
	import { onMount, setContext, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { key } from '../../utils/menu';

	export let x: number = 0;
	export let y: number = 0;

	let menuElement: HTMLElement;

	const dispatch = createEventDispatcher();

	$: () => {
		if (!menuElement) return;

		const rect = menuElement.getBoundingClientRect();
		x = Math.min(window.innerHeight - rect.height, x);
		if (y > window.innerHeight - rect.height) y -= rect.height;
	};

	setContext(key, {
		dispatchClick: () => dispatch('click')
	});

	function onPageClick(e: MouseEvent) {
		if (e.target === menuElement || menuElement.contains(e.target as Node)) return;
		dispatch('clickoutside');
	}
</script>

<svelte:body on:click={onPageClick} />

<div
	transition:fade={{ duration: 100 }}
	bind:this={menuElement}
	style="top: {y}px; left: {x}px;"
	class="absolute grid border border-gray-500 bg-white z-50 rounded-md"
>
	<slot />
</div>
