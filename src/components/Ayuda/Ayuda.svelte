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

<div style={"height: 38rem"} class="w-full flex flex-row divide-x overflow-hidden">
    <div class="w-1/4 h-full flex flex-col  overflow-x-hidden overflow-y-scroll whitespace-nowrap">
        {#each itemsAyuda.categorias as categoria, indexCategoria}
            <div class="w-full">
                <div class="w-full h-12 py-2 px-1 ">
                    <p class="text-base font-semibold text-left text-slate-900">
                        {indexCategoria + 1} .- {categoria.titulo}
                    </p>
                </div>
                <hr class="w-full bg-black" />
                <div class="flex flex-col w-full ">
                    {#each categoria.items as item, indexItem}
                        <button 
                            title={item.titulo}
                            class="h-12 w-full py-2 px- { (itemSeleccionado === indexItem && categoriaSeleccionada === indexCategoria) ? 'hover:text-violet-600 text-violet-600' : 'text-slate-600 hover:text-slate-900'}" 
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
    <div class="w-3/4 h-full pb-10">
        <div class="w-full h-9 overflow-hidden whitespace-nowrap border-b border-slate-300 shadow-2xl">
            <h1 class="text-2xl text-sky-500 font-bold text-center w-full">
                {itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].titulo}
            </h1>
        </div>
        <div bind:this={bindScroll} class="w-full h-full overflow-y-scroll px-6">
            <article>
                <svelte:component this={componenteSeleccionado} />
            </article>
            <div class="my-4 flex flex-row m-1/2 justify-around text-white text-xl font-bold text-center">
                <button 
                    title={"Anterior"}
                    class="py-2 px-3 rounded-lg shadow-md bg-sky-500 hover:bg-sky-700"
                    on:click={onClickAnterior}
                >
                    <p >
                        Anterior
                    </p>
                </button>
                <button 
                    title={"Siguiente"}
                    class="py-2 px-3 rounded-lg shadow-md bg-sky-500 hover:bg-sky-700"
                    on:click={onClickSiguiente}
                >
                    <p >
                        Siguiente
                    </p>
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    article :global(h1) {
        @apply text-2xl text-sky-600 font-bold text-center pb-2 mb-4 w-full border-b border-slate-300;
    }

    article :global(h2) {
        @apply text-xl font-bold text-sky-600 text-justify mx-auto w-full my-4 pt-3 border-t border-slate-200;
    }

    article :global(h5) {
        @apply text-sm font-bold text-slate-500 text-center w-full my-4 ;
    }

    article :global(p) {
        @apply text-lg my-4 text-justify font-sans;
    }

    article :global(img) {
        @apply rounded-2xl mx-auto border-2 border-indigo-500 my-4 max-w-2xl max-h-72 shadow-2xl;
    }
</style>