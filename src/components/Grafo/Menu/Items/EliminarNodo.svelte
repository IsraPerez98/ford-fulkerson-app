<script lang="ts">
    
    export let toggleEliminacionNodo: Function;
    export let eliminandoNodo: boolean;

    function onClick() {
        toggleEliminacionNodo();
    }

</script>

<div class="mx-auto mt-4 text-white font-bold">
    {#if eliminandoNodo}
        <button class="w-36 bg-red-700 hover:bg-red-500   px-4 py-2 rounded" on:click={onClick}>
            Cancelar
        </button>
    {:else}
        <button on:click={onClick} class="w-36 bg-red-700 hover:bg-red-500 py-2 px-4 rounded">
            Eliminar Nodo
        </button>
    {/if}
</div>