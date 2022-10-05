<script lang="ts">
    import { afterUpdate } from "svelte";
    import type Consola from "../../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";

    export let consola: Consola;

    $: textoExplicativo = consola.textoExplicativo;

    let divScroll: HTMLDivElement;

    function autoScroll(): void {
        if(divScroll) {
            console.log("autoscroll");
            console.log(divScroll.scrollHeight);
            divScroll.scrollTop = divScroll.scrollHeight;
        }
    }

    afterUpdate(autoScroll);

</script>

{#if textoExplicativo && textoExplicativo.length > 0}
    <div class="absolute bottom-0 right-0">
        <div class="flex items-center justify-between rounded-t-lg bg-indigo-700 pl-16 py-2 px-9">
            <p class="text-base">
                Información del Algoritmo de Flujo Máximo
            </p>
        </div>
        <div class="flex flex-row">
            <div class="flex flex-col h-auto py-2 px-1 w-12 bg-slate-900 text-xs text-center ">
                <!--TODO: MENU PARA CATEGORIAS-->
                <button class="py-3 hover:bg-gray-700 active:bg-gray-700 ">
                    Info
                </button>
            </div>
            <div bind:this={divScroll} class="bg-white overflow-auto h-72 shadow-lg ring-1 flex flex-col divide-y ">
                <Explicacion
                    textoExplicativo={textoExplicativo}
                />
            </div>
        </div>
    </div>
{/if}