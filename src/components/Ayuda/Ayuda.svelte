<script lang="ts">
    import { afterUpdate } from 'svelte';

    import type ItemsAyuda from "../../interfaces/ItemsAyuda";

    //@ts-ignore
    import Interfaz from './Items/App/Interfaz.md';
    //@ts-ignore
    import MenuSuperior from './Items/App/MenuSuperior.md';
    //@ts-ignore
    import SeccionGrafo from './Items/App/SeccionGrafo.md';
    //@ts-ignore
    import SeccionInferior from './Items/App/SeccionInferior.md';

    //@ts-ignore
    import Grafo from "./Items/Grafo/Grafo.md";
    //@ts-ignore
    import MatrizAdyacencia from "./Items/Grafo/MatrizAdyacencia.md";
    //@ts-ignore
    import GrafoDirigido from "./Items/Grafo/GrafoDirigido.md";
    
    //@ts-ignore
    import RedDeFlujo from "./Items/FlujoMaximo/RedDeFlujo.md";
    //@ts-ignore
    import ProblemaFlujoMaximo from "./Items/FlujoMaximo/ProblemaFlujoMaximo.md";
    //@ts-ignore
    import TeoremaFMCM from "./Items/FlujoMaximo/TeoremaFMCM.md";
    //@ts-ignore
    import AlgoritmoFordFulkerson from "./Items/FlujoMaximo/AlgoritmoFordFulkerson.md";

    const itemsAyuda: ItemsAyuda = {
        categorias: [
            {
                titulo: "Entendiendo la aplicación",
                items: [
                    {
                        titulo: "Interfaz",
                        componente: Interfaz,
                    },
                    {
                        titulo: "Menú superior",
                        componente: MenuSuperior,
                    },
                    {
                        titulo: "Grafo",
                        componente: SeccionGrafo,
                    },
                    {
                        titulo: "Sección inferior",
                        componente: SeccionInferior,
                    },
                ]
            },
            {
                titulo: "Conceptos de grafos",
                items: [
                    {
                        titulo: "Grafo",
                        componente: Grafo,
                    },
                    {
                        titulo: "Matriz de adyacencia",
                        componente: MatrizAdyacencia,
                    },
                    {
                        titulo: "Grafo dirigido",
                        componente: GrafoDirigido,
                    }
                ]
            },
            {
                titulo: "Conceptos del flujo maximo",
                items: [
                    {
                        titulo: "Red de flujo",
                        componente: RedDeFlujo,
                    },
                    {
                        titulo: "Problema de flujo maximo",
                        componente: ProblemaFlujoMaximo,
                    },
                    {
                        titulo: "Flujo máximo y corte mínimo",
                        componente: TeoremaFMCM,
                    },
                    {
                        titulo: "Algoritmo de Ford-Fulkerson",
                        componente: AlgoritmoFordFulkerson,
                    }
                ]
            }
        ]
    }

    let bindScroll = null;

    let categoriaSeleccionada = 0;
    let itemSeleccionado = 0;
    let componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;

    function onClickItem(indexCategoria: number, indexItem: number): void {
        categoriaSeleccionada = indexCategoria;
        itemSeleccionado = indexItem;

        componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;
    }

    function onClickAnterior() {
        itemSeleccionado--;
        if (itemSeleccionado < 0) {
            categoriaSeleccionada--;
            if (categoriaSeleccionada < 0) {
                categoriaSeleccionada = itemsAyuda.categorias.length - 1;
            }
            itemSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items.length - 1;
        }

        componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;
    }

    function onClickSiguiente() {
        itemSeleccionado++;
        if (itemSeleccionado >= itemsAyuda.categorias[categoriaSeleccionada].items.length) {
            categoriaSeleccionada++;
            if (categoriaSeleccionada >= itemsAyuda.categorias.length) {
                categoriaSeleccionada = 0;
            }
            itemSeleccionado = 0;
        }

        componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;
    }

    afterUpdate(() => {
        if(bindScroll) {
            bindScroll.scrollTop = 0;
        }
    });


</script>

<div style={"height: 40rem"} class="w-full flex bg-white dark:bg-slate-800 flex-row overflow-hidden px-3">
    <div class="w-1/4 h-full py-2 ">
        <div class="w-full h-full flex flex-col overflow-x-hidden overflow-y-scroll whitespace-nowrap">
            {#each itemsAyuda.categorias as categoria, indexCategoria}
                <div class="w-full">
                    <div class="w-full h-10 px-1 flex">
                        <p class="text-base font-semibold text-left text-slate-900 dark:text-slate-300 my-auto">
                            {indexCategoria + 1} .- {categoria.titulo}
                        </p>
                    </div>
                    <hr class="w-full border-slate-400/50" />
                    <div class="flex flex-col w-full ">
                        {#each categoria.items as item, indexItem}
                            <button 
                                title={item.titulo}
                                class="h-10 w-full py-2 { (itemSeleccionado === indexItem && categoriaSeleccionada === indexCategoria) ? 'hover:text-violet-600 text-violet-600 dark:text-blue-400 dark:hover:text-blue-400' : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-300' } " 
                                on:click={() => {onClickItem(indexCategoria, indexItem)}}
                            >
                                <p class="text-sm font-medium text-left ">
                                    {indexCategoria + 1}-{indexItem + 1}.- {item.titulo}
                                </p>
                            </button>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="w-3/4 h-full pb-4">
        <div bind:this={bindScroll} class=" w-full h-full overflow-y-scroll ">
            <div class="sticky top-0 dark:bg-slate-800/80 bg-white/60 backdrop-blur w-full pr-12 h-12 overflow-hidden whitespace-nowrap border-b border-slate-300 shadow-2xl flex">
                <h1 class="text-2xl text-sky-500 font-bold text-center w-full my-auto">
                    {itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].titulo}
                </h1>
            </div>
            <article class="px-6 dark:text-slate-200">
                <svelte:component this={componenteSeleccionado} />
                <div class="mb-4 mt-6 flex flex-row m-1/2 justify-around text-white text-lg font-bold text-center">
                    <button 
                        title={"Anterior"}
                        class="h-12 w-24 rounded-xl shadow-lg bg-indigo-500 hover:bg-indigo-600 border border-slate-400/20 flex"
                        on:click={onClickAnterior}
                    >
                        <span class="m-auto" >
                            Anterior
                        </span>
                    </button>
                    <button 
                        title={"Siguiente"}
                        class="h-12 w-24 rounded-xl shadow-lg bg-indigo-500 hover:bg-indigo-600 border border-slate-400/20 flex"
                        on:click={onClickSiguiente}
                    >
                        <span class="m-auto " >
                            Siguiente
                        </span>
                    </button>
                </div>
            </article>
        </div>
    </div>
</div>

<style>
    article :global(h1) {
        @apply text-2xl text-sky-500 font-bold text-center w-full ;
    }

    article :global(h2) {
        @apply text-xl font-bold text-sky-500  text-justify mx-auto w-full my-4 pt-3 border-t border-slate-400/50;
    }

    article :global(h5) {
        @apply text-sm font-bold text-slate-500 text-center w-full my-4 ;
    }

    article :global(p) {
        @apply text-lg my-4 text-justify font-sans;
    }

    article :global(img) {
        @apply rounded-2xl mx-auto border-2 border-blue-600 my-4 max-w-2xl max-h-72 shadow-2xl;
    }
</style>