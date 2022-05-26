<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../interfaces/Arista";

    import Flecha from "./flecha.svelte";

    export let svggrafo: any;
    export let arista: Arista;

    let svgarista: any;

    $: if(svggrafo && arista) {
        draw();
    }

    onMount(() => {
        draw();
    });

    function draw() {
        //console.log("Dibujando arista " + arista.id);
        if(!svggrafo || !arista) {
            return;
        }

        if(svgarista){
            svgarista.remove();
        }

        const x1 = arista.desde.posX;
        const y1 = arista.desde.posY;

        const x2 = arista.hasta.posX;
        const y2 = arista.hasta.posY;

        svgarista = svggrafo.append("svg")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

        //la flecha con direccion
        const line = svgarista.append("line")
            .attr("class", "stroke-teal-500 stroke-2")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

        
        const radiopeso = 20;


        //dibujamos el peso con un foreign object
        const fo = svgarista.append("foreignObject")
            .attr("x", (x2 + x1)/2 - radiopeso)
            .attr("y", (y1 + y2)/2 - radiopeso)
            .attr("width", radiopeso * 2)
            .attr("height", radiopeso * 2);
        
        const div = fo.append("xhtml:div")
            .attr("class", "flex w-full h-full bg-rose-900 rounded-full border border-white/20 overflow:hidden");
        
        const text = div.append("xhtml:p")
            .attr("class", "text-white text-center m-auto")
            .text(arista.peso);
        
        
    }

</script>

<main>
    <Flecha arista={arista} svgarista={svgarista} />
</main>