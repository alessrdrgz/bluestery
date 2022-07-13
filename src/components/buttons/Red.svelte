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
	class="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
  "><slot /></button
>
