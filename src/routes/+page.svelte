<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { Game } from './_classes/game';

	let gameStarted = $state(false);
	let game: Game;

	const initGame: Attachment<HTMLCanvasElement> = (element) => {
		game = new Game(element);
	};

	function startGame() {
		game.start();
		gameStarted = true;
	}
</script>

<canvas {@attach initGame}></canvas>
{#if !gameStarted}
	<div class="fixed inset-0 bg-black/20">
		<button
			class="absolute inset-0 m-auto size-fit rounded-lg border border-blue-700 bg-blue-400 px-3 py-2 text-5xl font-bold text-gray-900 shadow-lg shadow-black/50 hover:bg-blue-400/90"
			onclick={startGame}>Start Game</button
		>
	</div>
{/if}
