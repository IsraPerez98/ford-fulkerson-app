<script lang="ts">
    import type Consola from "../../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";

    export let consola: Consola;

    $: textoExplicativo = consola.textoExplicativo;

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
            <Explicacion
                textoExplicativo={textoExplicativo}
            />
        </div>
    </div>
{/if}