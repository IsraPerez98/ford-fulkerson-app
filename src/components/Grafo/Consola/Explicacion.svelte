<script lang="ts">
    import { afterUpdate } from "svelte";
    export let textoExplicativo: string[];

    let divTextoExplicativo: HTMLDivElement;

    function autoScroll(): void {
        if(divTextoExplicativo) {
            console.log("autoscroll");
            console.log(divTextoExplicativo.scrollHeight);
            divTextoExplicativo.scrollTop = divTextoExplicativo.scrollHeight;
        }
    }

    afterUpdate(autoScroll);
</script>

<div bind:this={divTextoExplicativo} class="bg-white overflow-auto h-72 shadow-lg ring-1 flex flex-col divide-y ">
    {#each textoExplicativo as linea}
        <div class="min-h-12 py-3 mx-4 flex items-center max-w-96 w-96 text-clip">
            <p class="text-slate-900 text-sm font-medium">
                {linea}
            </p>
        </div>
    {/each}
</div>