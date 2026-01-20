<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { Game } from './_classes/game';

	let gameStarted = $state(false);
	let game: Game;
	let screenWidth = $state<number>();
	let canvasWidth = $state<number>();

	const initGame: Attachment<HTMLCanvasElement> = (element) => {
		game = new Game(element);
	};

	function startGame() {
		game.start();
		gameStarted = true;
	}
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="relative p-8">
	<canvas {@attach initGame} bind:clientWidth={canvasWidth} class="mx-auto aspect-2/1 w-300"
	></canvas>
	{#if !gameStarted}
		<div class="absolute inset-0 bg-bg-dark/80">
			{#if screenWidth && canvasWidth && screenWidth < canvasWidth + 32}
				<div class="absolute top-16 right-8 left-8 mx-auto size-fit space-y-4 text-center">
					<p class="text-5xl">Your screen is too small!</p>
					<p class="text-3xl">Please resize the window or zoom out to fit the game.</p>
				</div>
			{:else}
				<button
					class="absolute top-16 right-0 left-0 mx-auto size-fit rounded-lg bg-primary px-3 py-2 text-5xl font-bold text-primary-text transition-colors hover:bg-primary-light"
					onclick={startGame}>Start Game</button
				>
			{/if}
		</div>
	{/if}
</div>
