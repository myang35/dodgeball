<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from './_ui/header/Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Dodgeball</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
