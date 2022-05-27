<script lang="ts">
    import AgregarNodo from "./Items/AgregarNodo.svelte";

    export let svggrafo: any;

    export let agregarNodo: Function;

</script>

<div>
    <div class="flex bg-black">
        <AgregarNodo svggrafo={svggrafo} agregarNodo={agregarNodo}/>
    </div>
</div>