<script lang="ts">
    import { afterUpdate, beforeUpdate } from "svelte";
    import type Consola from "../../../classes/Consola";

    export let consola: Consola;

    $: textoExplicativo = consola.textoExplicativo;

    let divTextoExplicativo = null;

    

    function autoScroll(): void {
        if(divTextoExplicativo) {
            console.log("autoscroll");
            console.log(divTextoExplicativo.scrollHeight);
            divTextoExplicativo.scrollTop = divTextoExplicativo.scrollHeight;
        }
    }

    afterUpdate(autoScroll);
</script>

{#if textoExplicativo && textoExplicativo.length > 0}
    <div class="absolute bottom-0 right-0">
        <div class="flex items-center justify-between rounded-t-lg bg-indigo-700 py-4 px-9">
            <p class="text-lg">
                Información del Algoritmo
            </p>
        </div>
        <div bind:this={divTextoExplicativo} class="bg-white overflow-auto h-72 shadow-lg ring-1 flex flex-col divide-y ">
            {#each textoExplicativo as linea}
                <div class="min-h-12 py-3 mx-4 flex items-center max-w-96 w-96 text-clip">
                    <p class="text-slate-900 text-sm font-medium">
                        {linea}
                    </p>
                </div>
            {/each}
        </div>
    </div>
{/if}