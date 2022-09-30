<script lang="ts">
    import type Consola from "../../../classes/Consola";

    export let consola: Consola;

    $: textoExplicativo = consola.textoExplicativo;
</script>

{#if textoExplicativo && textoExplicativo.length > 0}
    <div class="absolute bottom-0 right-0 border-solid border-2 border-green-600 p-4">
        {#each textoExplicativo as p}
            <p>{p}</p>
        {/each}
    </div>
{/if}