<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { Game } from './_utils/game';

	let gameRunning = $state(false);

	const initGame: Attachment<HTMLCanvasElement> = (element) => {
		const game = new Game(element);
		game.start();
	};
</script>

{#if gameRunning}
	<canvas {@attach initGame}></canvas>
{:else}
	<div class="flex h-screen flex-col items-center justify-center gap-4">
		<button
			class="rounded-lg border border-blue-700 bg-blue-400 px-3 py-2 text-2xl font-bold text-gray-900 shadow-lg shadow-black/50 hover:bg-blue-400/90"
			onclick={() => (gameRunning = true)}>Start Game</button
		>
	</div>
{/if}
