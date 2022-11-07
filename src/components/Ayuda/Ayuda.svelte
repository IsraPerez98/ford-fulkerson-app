<script lang="ts">

    import type ItemsAyuda from "../../interfaces/ItemsAyuda";

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
                titulo: "Conceptos básicos de un grafo",
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
                titulo: "Concetos del flujo maximo",
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
                        titulo: "Teorema de flujo máximo y corte mínimo",
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

    let categoriaSeleccionada = 0;
    let itemSeleccionado = 0;
    let componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;

    function onClickItem(indexCategoria: number, indexItem: number): void {
        categoriaSeleccionada = indexCategoria;
        itemSeleccionado = indexItem;

        componenteSeleccionado = itemsAyuda.categorias[categoriaSeleccionada].items[itemSeleccionado].componente;
    }
</script>

<div style={"height: 38rem"} class="w-full flex flex-row divide-x overflow-hidden">
    <div class="w-1/4 h-full flex flex-col divide-y overflow-x-hidden overflow-y-scroll whitespace-nowrap">
        {#each itemsAyuda.categorias as categoria, indexCategoria}
            <div class="w-full">
                <div class="w-full h-12 p-2">
                    <p class="text-lg font-semibold text-left">
                        {indexCategoria + 1} .- {categoria.titulo}
                    </p>
                </div>
                <hr class="w-full bg-black" />
                <div class="flex flex-col w-full divide-y">
                    {#each categoria.items as item, indexItem}
                        <button class="h-12 w-full p-2" on:click={() => {onClickItem(indexCategoria, indexItem)}}>
                            <p class="text-base font-medium text-left">
                                {indexCategoria + 1}-{indexItem + 1}.- {item.titulo}
                            </p>
                        </button>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    <div class="w-3/4 h-full overflow-y-scroll p-6">
        <svelte:component this={componenteSeleccionado} />
    </div>
</div>