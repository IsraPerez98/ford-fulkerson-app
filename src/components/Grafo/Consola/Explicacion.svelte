<script lang="ts">
    import { afterUpdate } from "svelte";

    export let textoExplicativo: string[];

    let divScroll: HTMLDivElement;

    function autoScroll(): void {
        if(divScroll) {
            //console.log("autoscroll");
            //console.log(divScroll.scrollHeight);
            divScroll.scrollTop = divScroll.scrollHeight;
        }
    }

    afterUpdate(autoScroll);
</script>

<div bind:this={divScroll} class="overflow-auto ">
    {#each textoExplicativo as linea}
            <div class="min-h-12 py-3 mx-4 flex items-center text-clip">
                <p class="text-slate-900 text-sm font-medium">
                    {linea}
                </p>
            </div>
    {/each}
</div>