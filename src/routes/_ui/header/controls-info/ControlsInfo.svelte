<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		class?: ClassValue;
	};

	let { class: classProp }: Props = $props();
</script>

<div class={['flex w-fit flex-col gap-12 rounded-lg border bg-bg p-8', classProp]}>
	<div class="flex flex-col gap-4">
		<h2 class="text-4xl font-bold whitespace-nowrap">Player 1:</h2>
		<ul class="flex flex-col gap-2">
			<li class="text-2xl whitespace-nowrap text-text-muted">
				<span class="font-bold">Move:</span> W, A, S, D
			</li>
			<li class="text-2xl whitespace-nowrap text-text-muted">
				<span class="font-bold">Shoot:</span> Spacebar
			</li>
		</ul>
	</div>
	<div class="flex flex-col gap-4">
		<h2 class="text-4xl font-bold whitespace-nowrap">Player 2:</h2>
		<ul class="flex flex-col gap-2">
			<li class="text-2xl whitespace-nowrap text-text-muted">
				<span class="font-bold">Move:</span> Arrow keys
			</li>
			<li class="text-2xl whitespace-nowrap text-text-muted">
				<span class="font-bold">Shoot:</span> Enter
			</li>
		</ul>
	</div>
</div>
