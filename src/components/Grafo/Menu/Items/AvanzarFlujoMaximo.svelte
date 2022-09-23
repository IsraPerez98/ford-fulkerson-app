<script lang="ts">
    export let avanzarFlujoMaximo: Function;

    function onClick() {
        avanzarFlujoMaximo();
    }

</script>

<div class="my-2 mx-auto text-white font-bold">
    <button on:click={onClick} class="w-32 bg-blue-700 hover:bg-blue-500 py-2 px-4 rounded">
        Siguiente
    </button>
</div>