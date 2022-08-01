<script lang="ts">

    import AgregarNodo from "./Items/AgregarNodo.svelte";
    import AgregarArista from "./Items/AgregarArista.svelte";
    import EliminarNodo from "./Items/EliminarNodo.svelte";

    export let agregarNodo: Function;
    
    export let toggleCreacionArista: Function;
    export let creandoArista: boolean;

    export let toggleEliminacionNodo: Function;
    export let eliminandoNodo: boolean;


    let items = [];

    $: {
        items = [
            {
                nombre: "Agregar Nodo",
                componente: AgregarNodo,
                props: {
                    agregarNodo: agregarNodo,
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
                nombre: "Eliminar Nodo",
                componente: EliminarNodo,
                props: {
                    toggleEliminacionNodo: toggleEliminacionNodo,
                    eliminandoNodo: eliminandoNodo,
                }
            },
        ];
    }

</script>
<foreignObject width="100%" height="100%">
    <div class="flex flex-row">
        {#each items as item}
            <div class="flex flex-col mx-2">
                <p class="text-center">{item.nombre}</p>
                <div class="flex w-32">
                    <div class="mx-auto">
                        <svelte:component this={item.componente} {...item.props} />
                    </div>
                </div>
            </div>
        {/each}
    </div>
</foreignObject>