<script lang="ts">
	import { Motion } from 'svelte-motion';
	export let toggle: boolean;
</script>

<Motion
	let:motion
	initial={{ width: '0px' }}
	variants={{
		open: { width: '310px' },
		closed: { width: '0px' }
	}}
	animate={toggle ? 'open' : 'closed'}
>
	<div
		use:motion
		class="absolute right-0 h-[calc(100vh-60px)] bg-[#008E90] overflow-x-hidden z-40 border-t border-gray-300"
	>
		<slot />
	</div>
</Motion>
