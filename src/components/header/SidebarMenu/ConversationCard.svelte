<script lang="ts">
	export let name: string;
	export let lastMessage: string;
	export let author: string;
	export let unreadMessages: number = 0;
</script>

<a href={`/room/${name}`}>
	<div class="border border-white rounded-lg mt-4 p-2 shadow-md bg-[#2867bb] relative">
		<p class="text-white uppercase">{name}</p>
		<p class="text-gray-300 overflow-x-clip">
			{`${author}: ${lastMessage}`}
		</p>
		{#if unreadMessages > 0}
			<span
				class="text-white bg-red-500 rounded-full p-1 absolute -top-3 -right-2 w-6 h-6 text-center flex items-center justify-center"
				>{unreadMessages}
			</span>
		{/if}
	</div>
</a>
