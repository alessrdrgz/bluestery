<script lang="ts">
	export let dotClass = '';
</script>

<div class={`loader ${$$props.class}`}>
	<div class={`loader-dot ${dotClass}`} />
	<div class={`loader-dot ${dotClass}`} />
	<div class={`loader-dot ${dotClass}`} />
	<div class={`loader-dot ${dotClass}`} />
	<div class={`loader-dot ${dotClass}`} />
	<div class={`loader-dot ${dotClass}`} />
</div>

<style>
	.loader {
		width: 40px;
		height: 40px;
		position: relative;
		animation: loader 2.5s infinite linear both;
	}

	.loader-dot {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		animation: loader-dot 2s infinite ease-in-out both;
	}

	.loader-dot:before {
		content: '';
		display: block;
		width: 25%;
		height: 25%;
		border-radius: 100%;
		animation: loader-dot-before 2s infinite ease-in-out both;
	}

	.loader-dot:nth-child(1) {
		animation-delay: -1.1s;
	}
	.loader-dot:nth-child(2) {
		animation-delay: -1s;
	}
	.loader-dot:nth-child(3) {
		animation-delay: -0.9s;
	}
	.loader-dot:nth-child(4) {
		animation-delay: -0.8s;
	}
	.loader-dot:nth-child(5) {
		animation-delay: -0.7s;
	}
	.loader-dot:nth-child(6) {
		animation-delay: -0.6s;
	}
	.loader-dot:nth-child(1):before {
		animation-delay: -1.1s;
	}
	.loader-dot:nth-child(2):before {
		animation-delay: -1s;
	}
	.loader-dot:nth-child(3):before {
		animation-delay: -0.9s;
	}
	.loader-dot:nth-child(4):before {
		animation-delay: -0.8s;
	}
	.loader-dot:nth-child(5):before {
		animation-delay: -0.7s;
	}
	.loader-dot:nth-child(6):before {
		animation-delay: -0.6s;
	}

	@keyframes loader {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loader-dot {
		80%,
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes loader-dot-before {
		50% {
			transform: scale(0.4);
		}
		100%,
		0% {
			transform: scale(1);
		}
	}
</style>
