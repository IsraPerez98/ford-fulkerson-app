<script lang="ts">
	import Modal from 'svelte-simple-modal';

	import Tailwindcss from './Tailwindcss.svelte';
	import Canvas from './components/Canvas/Canvas.svelte';

	import mobile from 'is-mobile';
	
	$: innerWidth = window.innerWidth;
	$: innerHeight = window.innerHeight;

	if (mobile()) {
		window.alert("Este sitio no está optimizado para dispositivos móviles. Se recomienda acceder desde un dispositivo de escritorio.");
	}

</script>

<Tailwindcss />
<svelte:window bind:innerWidth bind:innerHeight />

<Modal 
	styleWindow={{ width: '70rem', height: '40rem', overflow: 'hidden' }}
	styleCloseButton={{ right: '3rem', top: '12px' }}
	styleContent={{ padding: '0' }}
>
<main class="w-full h-full">
	<Canvas width={innerWidth} height={innerHeight} />
</main>
</Modal>