<script lang="ts">
	import '../styles/global.css';
	import '../styles/app.css';
	import { supabase } from '../services/supabase';
	import { refreshUserSession } from '../services/user';

	const session = supabase.auth.session();
	const userPromise = refreshUserSession({ session });
</script>

{#await userPromise then user}
	<main class="h-full w-full">
		<slot />
	</main>
{/await}
