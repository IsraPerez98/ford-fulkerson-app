<script lang="ts">
    import { afterUpdate } from "svelte";
    import autoAnimate from "../../util/autoAnimate";
    import { twemoji } from 'twemoji-svelte-action';

    export let textoExplicativo: string[];
    let prevTextoExplicativo: string;

    let divScroll: HTMLDivElement;

    function autoScroll(): void {
        if(divScroll) {
            //console.log("autoscroll");
            //console.log(divScroll.scrollHeight);
            divScroll.scrollTop = divScroll.scrollHeight;
        }
    }

    afterUpdate(() => {
        const ultimoTexto = textoExplicativo[textoExplicativo.length - 1];
        if(prevTextoExplicativo !== ultimoTexto) {
            prevTextoExplicativo = ultimoTexto;
            autoScroll();
        }
    });

</script>

<div bind:this={divScroll} use:autoAnimate class="overflow-auto h-full w-full divide-y divide-slate-700/60 dark:divide-slate-300/60 text-slate-900 dark:text-slate-200">
    {#if textoExplicativo.length === 0}
        <div class="text-center h-full w-full flex p-4">
            <p class="text-base md:text-xl m-auto">
                Se debe iniciar el algoritmo para ver su explicación.
            </p>
        </div>
    {:else}
        {#each textoExplicativo as linea}
            <div class="min-h-12 py-3 mx-4 flex items-center text-clip">
                <p use:twemoji={{className: 'emoji-explicacion'}} class="flex flex-row text-sm font-medium">
                    {linea}
                </p>
            </div>
        {/each}
    {/if}
    
</div>

<style global>
    img.emoji-explicacion {
        height: 1.25em;
        width: 1.25em;
        margin-right: 1.25em;
    }
</style>