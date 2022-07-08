export function tooltip(element: HTMLElement) {
	let div: HTMLDivElement;
	let title: string;
	function mouseOver(e: MouseEvent) {
		title = element.getAttribute('title') ?? '';
		element.removeAttribute('title');

		div = document.createElement('div');
		div.textContent = title;
		div.setAttribute(
			'style',
			`
        top: ${e.pageX + 5}px;
        left: ${e.pageY + 5}px;
      `
		);
		div.setAttribute(
			'class',
			'absolute p-2 rounded-lg bg-black bg-opacity-60 text-white text-xs shadow-lg border-black z-10'
		);

		document.body.appendChild(div);
	}
	function mouseMove(e: MouseEvent) {
		div.style.left = `${e.pageX + 5}px`;
		div.style.top = `${e.pageY + 5}px`;
	}
	function mouseLeave() {
		document.body.removeChild(div);
		element.setAttribute('title', title);
	}

	element.addEventListener('mouseover', mouseOver);
	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	};
}
