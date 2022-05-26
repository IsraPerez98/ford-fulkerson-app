<script lang="ts">
    import { onMount } from "svelte";
    
    import type Nodo from "../../interfaces/Nodo";

    export let svggrafo: any;
    export let nodo: Nodo;

    let svgnodo: any;

    const radio = 30;

    $: if(svggrafo && nodo) {
        draw();
    }

    onMount(() => {
        draw();
    });

    function draw() {
        //console.log("Dibujando nodo " + nodo.id);
        if(!svggrafo || !nodo) {
            return;
        }

        if(svgnodo){
            svgnodo.remove();
        }

        svgnodo = svggrafo.append("svg");
        
        const fo = svgnodo.append("foreignObject")
            .attr("x", nodo.posX - radio)
            .attr("y", nodo.posY - radio)
            .attr("width", radio * 2)
            .attr("height", radio * 2);
        
        const div = fo.append("xhtml:div")
            .attr("class", "flex w-full h-full bg-blue-900 rounded-full border border-white/20 overflow:hidden");
        
        const text = div.append("xhtml:p")
            .attr("class", "text-white text-center m-auto")
            .text(nodo.nombre);
    }
</script>