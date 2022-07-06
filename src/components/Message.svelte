<script lang="ts">
	import { user } from '../store/userStore';
	import type { Message } from '@twilio/conversations';
	export let message: Message;
	const { body, author } = message;
	let userOrigin = message.author === $user?.username ? 'local' : 'remote';
</script>

<div class={`m-2 w-3/6 ${userOrigin}`}>
	<p class="m-0 p-0">{body}</p>
	<small class="text-xs">{author}</small>
</div>

<style>
	.local {
		text-align: right;
		margin-left: auto;
		margin-right: 20px;
	}
	.remote {
		text-align: left;
		margin-right: auto;
		margin-left: 20px;
	}
</style>
