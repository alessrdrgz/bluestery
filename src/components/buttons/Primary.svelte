<script lang="ts">
	let buttonProps = {
		class: [$$restProps.class]
	};
</script>

<button
	type="button"
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:focus
	{...buttonProps}
	class="text-white bg-blue-700 hover:bg-blue-80 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
	><slot /></button
>
