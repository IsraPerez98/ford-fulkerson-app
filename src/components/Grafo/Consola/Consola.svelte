<script lang="ts">
    import type Consola from "../../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";
    import Pseudocodigo from "./Pseudocodigo.svelte";
    import RedResidual from "./RedResidual.svelte";

    export let consola: Consola;

    $: categoria = consola.categoria;

    function onClickButtonExplicacion(): void {
        consola.cambiarCategoria("EXPLICACION");
    }

    function onClickButtonPseudocodigo(): void {
        consola.cambiarCategoria("PSEUDOCODIGO");
    }

    function onClickButtonRedAumentada(): void {
        consola.cambiarCategoria("RED_RESIDUAL");
    }

    function onClickAbrir() {
        consola.abrir();
    }

    function onClickCerrar() {
        consola.cerrar();
    }

</script>

<div class="absolute bottom-0 right-0">
    {#if consola.abierta }
            <div class="flex items-center justify-between rounded-t-lg bg-indigo-700 pl-16 py-2 px-9">
                <p class="text-base">
                    Información del Algoritmo de Flujo Máximo
                </p>
                <button class="text-2xl" on:click={onClickCerrar}>
                    <i>X</i>
                </button>
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
                    <button on:click={onClickButtonRedAumentada} class:active={categoria === "RED_RESIDUAL"} class="py-3 hover:bg-gray-700 active:bg-gray-700 ">
                        Red Residual
                    </button>
                </div>
                <div class="bg-white overflow-auto h-72 w-[32rem] shadow-lg ring-1 flex flex-col divide-y ">
                    {#if categoria === "EXPLICACION"}
                        <Explicacion 
                            textoExplicativo={consola.textoExplicativo}
                        />
                    {:else if categoria === "PSEUDOCODIGO"}
                        <Pseudocodigo 
                            pseudoCodigo={consola.pseudoCodigo} 
                            lineaActual={consola.ubicacionPseudoCodigo}
                        />
                    {:else if categoria === "RED_RESIDUAL"}
                        <RedResidual
                            matrizAdyacencia={consola.grafo.matrizAdyacencia}
                            redResidual={consola.grafo.redResidual}
                        />
                    {/if}
                </div>
            </div>
    {:else} <!-- Consola cerrada / boton abrir -->
        <div class="bg-white rounded-full w-16 h-16 mr-4 mb-4">
            <button on:click={onClickAbrir} class="w-full h-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-700" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 0v12h12V3H4z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    {/if}
</div>