<script lang="ts">
    export let textoExplicativo: string[];
</script>

{#each textoExplicativo as linea}
    <div class="min-h-12 py-3 mx-4 flex items-center max-w-96 w-96 text-clip">
        <p class="text-slate-900 text-sm font-medium">
            {linea}
        </p>
    </div>
{/each}