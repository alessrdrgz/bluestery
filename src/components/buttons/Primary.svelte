<script lang="ts">
	let buttonProps = {
		class: $$restProps.class,
		disabled: $$restProps.disabled,
		type: $$restProps.type || 'button'
	};
</script>

<button
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:focus
	{...buttonProps}
	class={`text-white bg-blue-700 hover:bg-blue-80 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-500 disabled:hover:bg-gray-500 transition-colors ease-in-out duration-500 ${buttonProps.class}`}
	><slot /></button
>
