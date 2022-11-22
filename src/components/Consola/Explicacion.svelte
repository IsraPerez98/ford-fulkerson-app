<script lang="ts">
    import { afterUpdate } from "svelte";
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

<div bind:this={divScroll} class="overflow-auto h-full w-full">
    {#if textoExplicativo.length === 0}
        <div class="text-center text-gray-500 h-full w-full flex">
            <p class="text-xl m-auto">
                Se debe iniciar el algoritmo para ver su explicación.
            </p>
        </div>
    {:else}
        {#each textoExplicativo as linea}
            <div class="min-h-12 py-3 mx-4 flex items-center text-clip">
                <p use:twemoji={{className: 'emoji-explicacion'}} class="flex flex-row text-slate-900 text-sm font-medium">
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