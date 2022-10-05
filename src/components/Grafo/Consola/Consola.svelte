<script lang="ts">
    import type Consola from "../../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";
    import Pseudocodigo from "./Pseudocodigo.svelte";

    export let consola: Consola;

    $: categoria = consola.categoria;

    $: textoExplicativo = consola.textoExplicativo;

    function onClickButtonExplicacion(): void {
        consola.cambiarCategoria("EXPLICACION");
    }

    function onClickButtonPseudocodigo(): void {
        consola.cambiarCategoria("PSEUDOCODIGO");
    }

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
                <button on:click={onClickButtonExplicacion} class:active={categoria === "EXPLICACION" } class="py-3 hover:bg-gray-700 active:bg-gray-700 ">
                    Info
                </button>
                <button on:click={onClickButtonPseudocodigo} class:active={categoria === "PSEUDOCODIGO"} class="py-3 hover:bg-gray-700 active:bg-gray-700 ">
                    Pseudocodigo
                </button>
            </div>
            <div class="bg-white overflow-auto h-72 w-[32rem] shadow-lg ring-1 flex flex-col divide-y ">
                {#if categoria === "EXPLICACION"}
                    <Explicacion 
                        textoExplicativo={textoExplicativo}
                    />
                {:else if categoria === "PSEUDOCODIGO"}
                    <Pseudocodigo 
                        pseudoCodigo={consola.pseudoCodigo} 
                        lineaActual={consola.ubicacionPseudoCodigo}
                    />
                {/if}
            </div>
        </div>
    </div>
{/if}