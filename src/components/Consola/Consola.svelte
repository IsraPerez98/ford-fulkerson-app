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
        <div class="rounded-t-xl overflow-hidden border-x border-t border-slate-600/40 shadow-2xl">
            <div class="flex bg-neutral-200 dark:bg-neutral-900 h-10 border-b border-slate-600/40 backdrop-blur">
                <div class="ml-0 h-full w-10 md:w-12 flex items-center justify-center">
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
            <div class="flex flex-row h-full w-full">
                <div use:twemoji={{className: 'emoji'}} class="flex flex-col h-44 lg:h-72 space-y-4 w-10 md:w-12 bg-neutral-200 dark:bg-neutral-900 text-xl text-center  border-r border-slate-600/30">
                    <!--TODO: MENU PARA CATEGORIAS-->
                    <button on:click={onClickButtonExplicacion} title="Explicación" class="p-2 {categoria === "EXPLICACION" ? 'bg-gray-400 dark:bg-neutral-700' : 'hover:bg-gray-300 dark:hover:bg-neutral-800'}">
                        ℹ️
                    </button>
                    <button on:click={onClickButtonPseudocodigo} title="Pseudocodigo" class="p-2 {categoria === "PSEUDOCODIGO" ? 'bg-gray-400 dark:bg-neutral-700' : 'hover:bg-gray-300 dark:hover:bg-neutral-800'}">
                        🧑‍💻
                    </button>
                    <button on:click={onClickButtonRedAumentada} title="Red Residual" class="p-2 {categoria === "RED_RESIDUAL" ? 'bg-gray-400 dark:bg-neutral-700' : 'hover:bg-gray-300 dark:hover:bg-neutral-800'}">
                        🔢
                    </button>
                </div>
                <div class="overflow-auto h-44 lg:h-72 w-72 md:w-[32rem] shadow-lg flex flex-col divide-y bg-white/80 dark:bg-slate-900/80 backdrop-blur">
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
        </div>
    {:else} <!-- Consola cerrada / boton abrir -->
        <div class="bg-indigo-600/90 dark:bg-white/80 backdrop-blur border border-slate-600/40 rounded-full w-10 h-10 lg:w-16 lg:h-16 mb-2 mr-2 lg:mr-4 lg:mb-4 shadow-xl">
            <button 
                on:click={onClickAbrir} 
                title={'Explicación del algorítmo'} 
                
                class="w-full h-full flex items-center justify-center disabled:grayscale"
            >
                <div class="w-[62.5%] h-[62.5%] bg-violet-700 dark:bg-indigo-700 border border-slate-700/40 rounded-full flex items-center justify-center">
                    <p class="text-lg lg:text-2xl text-white">?</p>
                </div>
            </button>
        </div>
    {/if}
</div>