<script lang="ts">

    import CalcularFlujoMaximo from "./Items/CalcularFlujoMaximo.svelte";
    import AvanzarFlujoMaximo from "./Items/AvanzarFlujoMaximo.svelte";
    import AgregarVertice from "./Items/AgregarVertice.svelte";
    import AgregarArista from "./Items/AgregarArista.svelte";
    import EliminarVertice from "./Items/EliminarVertice.svelte";

    export let calcularFlujoMaximo: Function;

    export let avanzarFlujoMaximo: Function;

    /*
    export let getPosicionSVG: Function;
    export let agregarVertice: Function;
    
    export let toggleCreacionArista: Function;
    export let creandoArista: boolean;

    export let toggleEliminacionVertice: Function;
    export let eliminandoVertice: boolean;
    */


    let items = [];

    $: {
        items = [
            {
                nombre: "Calcular Flujo Maximo",
                componente: CalcularFlujoMaximo,
                props: {
                    calcularFlujoMaximo: calcularFlujoMaximo,
                }
            },
            {
                nombre: "Siguiente",
                componente: AvanzarFlujoMaximo,
                props: {
                    avanzarFlujoMaximo: avanzarFlujoMaximo,
                }
            }
            /*
            {
                nombre: "Agregar Vertice",
                componente: AgregarVertice,
                props: {
                    getPosicionSVG: getPosicionSVG,
                    agregarVertice: agregarVertice,
                }
            },
            {
                nombre: "Agregar Arista",
                componente: AgregarArista,
                props: {
                    toggleCreacionArista: toggleCreacionArista,
                    creandoArista: creandoArista,
                }
            },
            {
                nombre: "Eliminar Vertice",
                componente: EliminarVertice,
                props: {
                    toggleEliminacionVertice: toggleEliminacionVertice,
                    eliminandoVertice: eliminandoVertice,
                }
            },
            */
        ];
    }

</script>
<foreignObject width="100%" height="100%">
    <div class="flex flex-row">
        {#each items as item}
            <div class="flex flex-col mx-4">
                <p class="text-center">{item.nombre}</p>
                <div class="flex">
                    <div class="mx-auto">
                        <svelte:component this={item.componente} {...item.props} />
                    </div>
                </div>
            </div>
        {/each}
    </div>
</foreignObject>