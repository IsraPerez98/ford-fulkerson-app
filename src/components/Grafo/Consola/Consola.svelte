<script lang="ts">
    export let texto: string[];
</script>

{#if texto && texto.length > 0}
    <div class="absolute bottom-0 right-0 border-solid border-2 border-green-600 p-4">
        {#each texto as p}
            <p>{p}</p>
        {/each}
    </div>
{/if}