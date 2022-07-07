export function stringToColor({ str }: { str: string }) {
	const opts = {
		hue: [0, 360],
		sat: [30, 60],
		lit: [40, 60]
	};
	const range = function (hash: number, min: number, max: number) {
		const diff = max - min;
		const x = ((hash % diff) + diff) % diff;
		return x + min;
	};

	let hash = 0;
	if (str.length === 0) return hash;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}

	const h = range(hash, opts.hue[0], opts.hue[1]);
	const s = range(hash, opts.sat[0], opts.sat[1]);
	const l = range(hash, opts.lit[0], opts.lit[1]);

	return `hsl(${h}, ${s}%, ${l}%)`;
}
