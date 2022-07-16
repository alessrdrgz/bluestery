<script lang="ts">
	import RoomSelect from '$components/RoomSelect.svelte';
	import { user } from '$store/userStore';
	import LoginButton from '$components/buttons/Login.svelte';
</script>

<section class="h-full w-full">
	<div class="h-[60px] bg-blue-700 w-full border-b border-gray-300" />
	<div class="w-full">
		<h1
			class="text-transparent text-center text-6xl font-extrabold bg-clip-text bg-gradient-to-tr from-blue-300 via-blue-500 to-blue-700 mt-4"
		>
			Bluestery
		</h1>

		<div class="mx-auto w-fit text-2xl font-semibold mt-10 leading-10 text-center">
			<p>Mantén todos</p>
			<p>tus chats</p>
			<p>en secreto</p>
			<p>💬🔐</p>
		</div>

		{#if !$user}
			<div class="mx-auto flex items-center justify-center flex-col mt-10 gap-4">
				<LoginButton type="google" />
				<LoginButton type="github" />
			</div>
		{:else}
			<did class="mx-auto w-4/5">
				<RoomSelect />
			</did>
		{/if}
	</div>
</section>
