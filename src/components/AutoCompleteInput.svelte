<script lang="ts">
	let filteredData: string[] = [];
	let inputEl: HTMLInputElement;
	export let inputValue: string = '';
	let hiLiteIndex: number | null = null;
	export let data: Array<any>;
	export let objectType = false;
	export let objectKey = '';
	export let placeholder: string;

	const filterData = () => {
		let arr: string[] = [];
		if (inputValue) {
			data.forEach((v) => {
				if (objectType) {
					if (v[objectKey].toLowerCase().startsWith(inputValue.toLowerCase())) {
						arr = [...arr, makeMatchBold(v[objectKey])];
					}
				} else {
					if (v.toLowerCase().startsWith(inputValue.toLowerCase())) {
						arr = [...arr, makeMatchBold(v)];
					}
				}
			});
		}
		filteredData = arr;
	};

	const setInputVal = (val: string) => {
		inputValue = removeBold(val);
		filteredData = [];
		hiLiteIndex = null;
		inputEl.focus();
	};

	const makeMatchBold = (str: string) => {
		const matched = str.substring(0, inputValue.length);
		const makeBold = `<strong>${matched}</strong>`;
		return str.replace(matched, makeBold);
	};

	const removeBold = (str: string) => str.replace(/<\/?strong>/g, '');

	$: if (!inputValue) {
		filteredData = [];
		hiLiteIndex = null;
	}

	const navigateList = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			hiLiteIndex !== null
				? hiLiteIndex <= filteredData.length - 1
					? hiLiteIndex++
					: null
				: (hiLiteIndex = 0);
		} else if (e.key === 'ArrowUp' && hiLiteIndex !== null) {
			hiLiteIndex === 0 ? (hiLiteIndex = filteredData.length - 1) : hiLiteIndex--;
		} else if (e.key === 'Enter') {
			if (hiLiteIndex !== null) {
				setInputVal(filteredData[hiLiteIndex]);
			}
		}
	};
</script>

<svelte:window on:keydown={navigateList} />

<div class="absolute w-4/5">
	<input
		type="text"
		{placeholder}
		bind:this={inputEl}
		bind:value={inputValue}
		on:input={filterData}
		class="w-full p-2 placeholder:text-center"
	/>

	{#if filteredData.length > 0}
		<ul class="relative m-0 p-0 top-0 w-full border-gray-400 border bg-gray-200 rounded-b-lg">
			{#each filteredData as v, i}
				<li
					class={`list-none ${i === hiLiteIndex && 'bg-gray-200'} ${
						i === filteredData.length - 1 && `rounded-b-lg`
					} border-b-gray-600 border-b z-50 top-full left-0 right-0 p-3 cursor-pointer bg-white hover:bg-gray-200 hover:text-white active:bg-gray-200 active:text-white`}
					on:click={() => setInputVal(v)}
				>
					{@html v}
				</li>
			{/each}
		</ul>
	{/if}
</div>
