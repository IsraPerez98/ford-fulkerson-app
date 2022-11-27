<script lang="ts">
    import { twemoji } from 'twemoji-svelte-action';
    import type Consola from "../../classes/Consola";

    import Explicacion from "./Explicacion.svelte";
    import Pseudocodigo from "./Pseudocodigo.svelte";
    import RedResidual from "./RedResidual.svelte";

    export let consola: Consola;

    $: ejecutandoFlujoMaximo = consola.grafo.ejecutandoFlujoMaximo;

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
        /*
        if(ejecutandoFlujoMaximo){
            consola.abrir();
        }
        */
        consola.abrir();
    }

    function onClickCerrar() {
        consola.cerrar();
    }

</script>

<div class="absolute bottom-0 right-0 pointer-events-auto">
    {#if consola.abierta }
            <div class="flex rounded-t-xl bg-neutral-900 overflow-hidden h-10">
                <div class="ml-0 h-full w-12 flex items-center justify-center">
                    <!--- Button is a circle with an x in the middle -->
                    <button on:click={onClickCerrar} class="rounded-full bg-neutral-700 h-6 w-6 flex items-center justify-center">
                        <svg class="h-4 w-4 text-stone-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-base m-auto">
                    {titulo()}
                </p>
            </div>
            <div class="flex flex-row">
                <div use:twemoji={{className: 'emoji'}} class="flex flex-col h-auto space-y-4 w-12 bg-neutral-900 text-xl text-center ">
                    <!--TODO: MENU PARA CATEGORIAS-->
                    <button on:click={onClickButtonExplicacion} class:bg-violet-800={categoria === "EXPLICACION" } title="Explicación" class="p-2 hover:bg-gray-700">
                        🤔
                    </button>
                    <button on:click={onClickButtonPseudocodigo} class:bg-violet-800={categoria === "PSEUDOCODIGO"} title="Pseudocodigo" class="p-2 hover:bg-gray-700">
                        🖥️
                    </button>
                    <button on:click={onClickButtonRedAumentada} class:bg-violet-800={categoria === "RED_RESIDUAL"} title="Red Residual" class="p-2 hover:bg-gray-700">
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
        <div class="bg-indigo-600/90 dark:bg-white/80 backdrop-blur border border-slate-600/40 rounded-full w-16 h-16 mr-4 mb-4 shadow-xl">
            <button 
                on:click={onClickAbrir} 
                title={'Explicación del algorítmo'} 
                
                class="w-full h-full flex items-center justify-center disabled:grayscale"
            >
                <div class="w-10 h-10 bg-violet-700 dark:bg-indigo-700 border border-slate-700/40 rounded-full flex items-center justify-center">
                    <p class="text-2xl text-white">?</p>
                </div>
            </button>
        </div>
    {/if}
</div>