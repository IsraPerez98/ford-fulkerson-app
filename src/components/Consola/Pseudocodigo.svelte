<script lang="ts">
    import { afterUpdate } from "svelte";
    import autoAnimate from "../../util/autoAnimate";

    export let pseudoCodigo: string[];
    export let lineaActual: number;

    let prevLinea: number;

    let divScroll: HTMLDivElement;

    function autoScroll(): void {
        if(divScroll) {
            //console.log("autoscroll");
            //console.log(divScroll.scrollHeight);
            divScroll.scrollTop = divScroll.scrollHeight * (lineaActual / pseudoCodigo.length);
        }
    }

    afterUpdate(() => {
        if(prevLinea !== lineaActual) {
            prevLinea = lineaActual;
            autoScroll();
        }
    });
</script>

<div bind:this={divScroll} class="overflow-auto ">
    {#each pseudoCodigo as linea, index}
        <div use:autoAnimate class="min-h-12 py-3 mx-4 flex items-center whitespace-pre-wrap">
            {#if lineaActual === index}
                <p class="text-slate-900 text-sm font-medium bg-yellow-300">
                    {linea}
                </p>
            {:else}
                <p class="text-slate-900 text-sm font-medium">
                    {linea}
                </p>
            {/if}
        </div>
    {/each}
</div>