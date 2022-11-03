<script lang="ts">

	import Tailwindcss from './Tailwindcss.svelte';
	import Grafo from './components/Grafo/Grafo.svelte';
	
	$: innerWidth = window.innerWidth;
	$: innerHeight = window.innerHeight;

</script>

<Tailwindcss />
<svelte:window bind:innerWidth bind:innerHeight />

<main class="w-full h-full bg-stone-100 dark:bg-gray-800">
	<Grafo width={innerWidth} height={innerHeight} />
</main>