<script lang="ts">
	import Modal from 'svelte-simple-modal';

	import Tailwindcss from './Tailwindcss.svelte';
	import Canvas from './components/Canvas/Canvas.svelte';

</script>

<Tailwindcss />

<Modal 
	unstyled={true}
	classWindowWrap="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-black bg-opacity-50"
	classWindow="w-4/5 h-4/5 lg:w-[70rem] lg:h-[40rem] "
	classBg=""
	classContent="w-full h-full rounded-lg overflow-hidden"
	classCloseButton=""
>
<main class="w-full h-full">
	<Canvas />
</main>
</Modal>