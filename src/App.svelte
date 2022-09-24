<script lang="ts">

	import ModeSwitcher from './ModeSwitcher.svelte';
	import Tailwindcss from './Tailwindcss.svelte';
	import Grafo from './components/Grafo/Grafo.svelte';
	
	$: innerWidth = window.innerWidth;
	$: innerHeight = window.innerHeight;

</script>

<Tailwindcss />

<ModeSwitcher />
<svelte:window bind:innerWidth bind:innerHeight />

<main class="w-full h-full">
	<Grafo width={innerWidth} height={innerHeight} />
</main>