<script lang="ts">
	import ControlsInfo from './controls-info/ControlsInfo.svelte';

	let showControls = $state(false);
</script>

<header class="z-50 border-b bg-bg">
	<div class="container py-2">
		<div class="flex gap-8">
			<a href="/" class="text-xl font-bold tracking-wider">Dodgeball</a>
			<div class="relative">
				<button
					onclick={() => (showControls = !showControls)}
					class="rounded-lg border border-border-muted px-3 py-1 text-sm text-text-muted transition-colors hover:bg-bg-light hover:text-text/80"
					>Show Controls</button
				>
				{#if showControls}
					<ControlsInfo class="absolute top-full left-0" />
				{/if}
			</div>
		</div>
	</div>
</header>
