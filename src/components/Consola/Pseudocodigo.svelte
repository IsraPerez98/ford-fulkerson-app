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
    <div use:autoAnimate class="mx-4 flex flex-col items-center  text-slate-900 dark:text-slate-200 overflow-clip divide-y divide-slate-700/60 dark:divide-slate-300/60">
        {#each pseudoCodigo as linea, index}
                <div class="w-full mb-2 pt-2 md:mb-4 md:pt4">
                    <p class="text-xs md:text-sm md:font-medium whitespace-pre-wrap {lineaActual === index ? 'bg-green-500 dark:bg-green-700' : '' }">
                        {linea}
                    </p>
                </div>
        {/each}
    </div>
</div>