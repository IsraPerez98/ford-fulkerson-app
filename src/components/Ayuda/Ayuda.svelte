<script lang="ts">
    import { afterUpdate, getContext } from 'svelte';
    import autoAnimate from "../../util/autoAnimate";

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
    //@ts-ignore
    import MultiplesFuentesYSumideros from "./Items/FlujoMaximo/MultiplesFuentesYSumideros.md";

    //@ts-ignore
    import ApareamientosGrafosBipartitos from "./Items/Aplicaciones/ApareamientosGrafosBipartitos.md";
    //@ts-ignore
    import ProblemaDeRepresentantes from "./Items/Aplicaciones/ProblemaDeRepresentantes.md";
    //@ts-ignore
    import AsignacionDeBarcos from "./Items/Aplicaciones/AsignacionDeBarcos.md";
    //@ts-ignore
    import ComputacionDistribuida from "./Items/Aplicaciones/ComputacionDistribuida.md";

    //@ts-ignore
    const { close } = getContext('simple-modal');

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
                    },
                    {
                        titulo: "Múltiples fuentes y sumideros",
                        componente: MultiplesFuentesYSumideros,
                    }
                ]
            },
            {
                titulo: "Ejemplos de aplicaciones",
                items : [
                    {
                        titulo: "Apareamientos en grafos bipartitos",
                        componente: ApareamientosGrafosBipartitos,
                    },
                    {
                        titulo: "Problema de representantes",
                        componente: ProblemaDeRepresentantes,
                    },
                    {
                        titulo: "Asignación de barcos",
                        componente: AsignacionDeBarcos,
                    },
                    {
                        titulo: "Computación distribuida",
                        componente: ComputacionDistribuida,
                    }
                ]
            }
        ]
    }

    let bindScroll = null;

    let mostrandoContenido = false;

    let categoriaSeleccionada = 0;
    let itemSeleccionado = 0;
    let componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;

    function onClickItem(indexCategoria: number, indexItem: number): void {
        categoriaSeleccionada = indexCategoria;
        itemSeleccionado = indexItem;

        componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;
        mostrandoContenido = true;
    }

    function onClickAtrasMenu(): void {
        mostrandoContenido = false;
    }

    function onClickCerrar(): void {
        close();
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
        mostrandoContenido = true;
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
        mostrandoContenido = true;
    }

    afterUpdate(() => {
        if(bindScroll) {
            bindScroll.scrollTop = 0;
        }
    });


</script>

<div use:autoAnimate class="h-full w-full flex bg-white dark:bg-slate-800 flex-row overflow-hidden px-3">
    <div class="transition-[width] duration-300 lg:w-1/4 h-full py-2 { mostrandoContenido ? 'w-0 ' : 'w-full' } ">
        <div class="w-full h-full flex flex-col overflow-x-hidden overflow-y-scroll whitespace-nowrap ">
            <button 
                    class="ml-auto lg:hidden h-12 w-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 "
                    title="Cerrar"
                    on:click={() => {onClickCerrar()}}>
                    <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
            </button>
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
    <div class="transition-[width] duration-300 lg:w-3/4 h-full pb-4  { mostrandoContenido ? 'w-full' : 'w-0' } ">
        <div bind:this={bindScroll} class=" w-full h-full overflow-y-scroll ">
            <div class="sticky top-0 dark:bg-slate-800/80 bg-white/60 backdrop-blur w-full h-12 overflow-hidden whitespace-nowrap border-b border-slate-300 shadow-2xl flex">
                <button 
                    class="lg:hidden h-full w-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Atrás"
                    on:click={() => {onClickAtrasMenu()}}>
                    <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 class="text-xs md:text-base lg:text-2xl text-sky-500 font-bold text-center w-full my-auto">
                    {itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].titulo}
                </h1>
                <button 
                    class="h-full w-12 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 "
                    title="Cerrar"
                    on:click={() => {onClickCerrar()}}>
                    <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <article class="px-3 lg:px-6 dark:text-slate-200">
                <svelte:component this={componenteSeleccionado} />
                <div class="mb-4 mt-6 flex flex-row m-1/2 justify-around text-white lg:text-lg font-bold text-center">
                    <button
                        title={"Anterior"}
                        class="h-10 w-20 lg:h-12 lg:w-24 rounded-xl shadow-lg bg-indigo-500 hover:bg-indigo-600 border border-slate-400/20 flex"
                        on:click={onClickAnterior}
                    >
                        <span class="m-auto" >
                            Anterior
                        </span>
                    </button>
                    <button 
                        title={"Siguiente"}
                        class="h-10 w-20 lg:h-12 lg:w-24 rounded-xl shadow-lg bg-indigo-500 hover:bg-indigo-600 border border-slate-400/20 flex"
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
        @apply text-base my-4 text-justify font-sans;
    }

    article :global(ul) {
        @apply text-base my-4 text-justify font-sans ml-4 list-disc;
    }

    article :global(li) {
        @apply text-base my-4 text-justify font-sans;
    }

    article :global(img) {
        @apply rounded-2xl mx-auto border-2 border-blue-600 my-4 max-w-full shadow-2xl;

        
    }

    @media (min-width: 1024px) {
        
        article :global(img) {
            max-height: 20rem;
        }
    }
</style>