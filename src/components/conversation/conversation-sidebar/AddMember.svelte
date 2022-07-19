<script lang="ts">
	import { getAllUsers } from '../../../services/user';
	import { addUserToConversation } from '../../../services/chat';
	import { activeConversation } from '../../../store/conversationStore';
	import PrimaryButton from '../../../components/buttons/Primary.svelte';
	import RedButton from '../../../components/buttons/Red.svelte';
	import AutoComplete from '../../../components/conversation/AutoCompleteInput.svelte';
	import { generateConversationInviteUrl } from '../../../services/chat';
	import { user } from '../../../store/userStore';
	import { copyToClipboard } from '../../../utils/copy-to-clipboard';
	import SidebarMenuContainer from './SidebarMenuContainer.svelte';
	import type { Writable } from 'svelte/store';

	let selectedUser: string = '';
	let responseMessage: string;
	let responseError: boolean = false;
	let clipboardMessageEl: HTMLSpanElement;
	let urlLoading = false;
	export let toggler: Writable<boolean> & { next: (index?: number) => void };
	export let toggle: boolean = true;

	const userPromise = getAllUsers();

	const handleAddUser = async () => {
		if ($activeConversation && selectedUser) {
			const { message, error } = await addUserToConversation({
				conversation: $activeConversation,
				username: selectedUser
			});

			responseMessage = message;
			responseError = error || false;
		}
	};

	const generateUrl = async () => {
		urlLoading = true;
		if ($user?.token && $activeConversation?.sid) {
			const { message, error, url } = await generateConversationInviteUrl({
				token: $user.token,
				sid: $activeConversation.sid
			});

			if (error || message) {
				responseMessage = message;
				responseError = error;
			} else {
				copyToClipboard(url);
				clipboardMessageEl.classList.remove('hidden');
				setTimeout(() => {
					clipboardMessageEl.classList.add('hidden');
				}, 2000);
			}
		}
		urlLoading = false;
	};
</script>

<SidebarMenuContainer toggle={$toggler && toggle}>
	<section class="w-full pr-[60px]">
		<div class="p-3 w-fit">
			{#await userPromise then users}
				<h1 class="text-center mb-3 font-black text-lg text-white">Añadir un miembro</h1>
				<div class={`m-auto flex items-center flex-col mb-14${!responseError && 'mt-8'}`}>
					<AutoComplete
						data={users}
						placeholder="Nombre de usuario"
						objectType
						objectKey="username"
						bind:inputValue={selectedUser}
					/>
				</div>
				<div class="text-center pt-16">
					{#if $activeConversation !== null}
						<ul class={`grid grid-cols-2 gap-2 ${!responseMessage && 'mb-12'}`}>
							<li>
								<RedButton on:click={() => toggler.next()} class="w-full">Cancelar</RedButton>
							</li>
							<li>
								{#key selectedUser}
									<PrimaryButton
										on:click={handleAddUser}
										class="w-full"
										disabled={selectedUser === ''}>Añadir</PrimaryButton
									>
								{/key}
							</li>
						</ul>

						{#if responseMessage}
							<p
								class={`${
									responseError ? 'text-red-500' : 'text-white'
								} text-xs font-medium text-center mb-2`}
							>
								{responseMessage}
							</p>
						{/if}

						<div class="border-2 border-white rounded-lg w-full h-0 mx-auto m-5" />

						<div class="mx-auto relative">
							{#key urlLoading}
								<PrimaryButton on:click={generateUrl} class="w-full" disabled={urlLoading}
									>Generar enlace</PrimaryButton
								>
							{/key}
							<span class="text-gray-400 text-center block"
								>El enlace solo es válido durante 15 minutos</span
							>
							<span
								class="absolute -bottom-8 right-0 w-full bg-black bg-opacity-40 text-white rounded-lg hidden"
								bind:this={clipboardMessageEl}>Enlace copiado</span
							>
						</div>
					{/if}
				</div>
			{/await}
		</div>
	</section>
</SidebarMenuContainer>
