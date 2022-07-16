<script lang="ts">
	export let toggle: () => void;
	import { Motion } from 'svelte-motion';
</script>

<button on:click={toggle}>
	<Motion let:motion isSVG>
		<svg use:motion class={$$restProps.class} viewBox="0 0 23 23">
			<Motion
				let:motion
				isSVG
				variants={{ closed: { d: 'M 2 2.5 L 20 2.5' }, open: { d: 'M 3 16.5 L 17 2.5' } }}
			>
				<path use:motion class="fill-transparent stroke-2" />
			</Motion>

			<Motion
				let:motion
				isSVG
				variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
				transition={{ duration: 0.1 }}
			>
				<path use:motion class="fill-transparent stroke-2" d="M 2 9.423 L 20 9.423" />
			</Motion>

			<Motion
				let:motion
				isSVG
				variants={{
					closed: { d: 'M 2 16.346 L 20 16.346' },
					open: { d: 'M 3 2.5 L 17 16.346' }
				}}
			>
				<path use:motion class="fill-transparent stroke-2" />
			</Motion>
		</svg>
	</Motion>
</button>
