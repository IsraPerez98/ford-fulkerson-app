<script lang="ts">
    import { twemoji } from 'twemoji-svelte-action';
    import type Consola from "../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";
    import Pseudocodigo from "./Pseudocodigo.svelte";
    import RedResidual from "./RedResidual.svelte";

    export let consola: Consola;

    $: categoria = consola.categoria;

    $: titulo = () => {
        switch(categoria) {
            case "EXPLICACION":
                return "Explicación";
            case "PSEUDOCODIGO":
                return "Pseudocódigo";
            case "RED_RESIDUAL":
                return "Red Residual";
            default:
                return "Informacion del algoritmo";
        }
    }

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

<div class="absolute bottom-0 right-0 pointer-events-auto">
    {#if consola.abierta }
            <div class="flex rounded-t-lg bg-indigo-700 overflow-hidden h-8">
                <button class="text-base bg-rose-700 ml-0 h-full w-12" on:click={onClickCerrar}>
                    <p>X</p>
                </button>
                <p class="text-base m-auto">
                    {titulo()}
                </p>
            </div>
            <div class="flex flex-row">
                <div use:twemoji={{className: 'emoji'}} class="flex flex-col h-auto py-2 space-y-4 w-12 bg-slate-900 text-xl text-center ">
                    <!--TODO: MENU PARA CATEGORIAS-->
                    <button on:click={onClickButtonExplicacion} class:bg-violet-800={categoria === "EXPLICACION" } class="p-2 hover:bg-gray-700">
                        🤔
                    </button>
                    <button on:click={onClickButtonPseudocodigo} class:bg-violet-800={categoria === "PSEUDOCODIGO"} class="p-2 hover:bg-gray-700">
                        🖥️
                    </button>
                    <button on:click={onClickButtonRedAumentada} class:bg-violet-800={categoria === "RED_RESIDUAL"} class="p-2 hover:bg-gray-700">
                        🕸️
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
                <div class="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
                    <p class="text-2xl text-white">?</p>
                </div>
            </button>
        </div>
    {/if}
</div>