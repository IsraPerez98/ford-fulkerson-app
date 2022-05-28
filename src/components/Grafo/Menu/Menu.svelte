<script lang="ts">
    import AgregarNodo from "./Items/AgregarNodo.svelte";

    export let svggrafo: any;

    let items = [];

    $: if(svggrafo) {
        items = generarItems();
    }

    export let agregarNodo: Function;

    function generarItems() {
        return [
            {
                nombre: "Agregar Nodo",
                componente: AgregarNodo,
                props: {
                    svggrafo: svggrafo,
                    agregarNodo: agregarNodo,
                }
            }
        ];
    }



</script>

<div>
    <div class="flex bg-black">
        {#each items as item }
            <div>
                <div>
                    <p>
                        {#if item.nombre}
                            {item.nombre}
                        {/if}
                    </p>
                </div>
                <div>
                    <svelte:component this={item.componente} {...item.props} />
                </div>
            </div>
        {/each}
    </div>
</div>