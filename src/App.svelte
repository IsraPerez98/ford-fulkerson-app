<script lang="ts">

	import ModeSwitcher from './ModeSwitcher.svelte';
	import Tailwindcss from './Tailwindcss.svelte';
	import Grafo from './components/Grafo/Grafo.svelte';
	
	$: innerWidth = 800;
	$: innerHeight = 600;

</script>

<Tailwindcss />

<ModeSwitcher />
<svelte:window bind:innerWidth bind:innerHeight />

<main class="w-full h-full">
	<Grafo width={innerWidth} height={innerHeight} />
</main>