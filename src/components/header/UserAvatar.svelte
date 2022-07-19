<script lang="ts">
	export let url: string | undefined;
	export let circle: boolean = false;
</script>

<div
	id="user-avatar"
	class={`flex-shrink-0 flex-grow-0 basis-auto bg-contain shadow-md rounded ${
		circle ? 'rounded-full' : 'rounded-lg'
	} ${$$restProps.class}`}
	style="background-image: url('{url}')"
	on:click
/>
