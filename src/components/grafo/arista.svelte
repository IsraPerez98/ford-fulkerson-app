<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../interfaces/Arista";
    

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
            .attr("class", "stroke-indigo-500 stroke-2")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

        
        
        const flecha = svgarista.append("polygon")
            .attr("class", "fill-indigo-500")
            .attr("points", "0,0 -10,10 10,10")
            
            //TODO: ROTAR HACIA X2,Y2
            
            .attr("transform", `translate( ${(x2 + x1)/2} , ${ (y2 + y1)/2} ) `);
        
        
        
        /*
        //el peso
        const text = svgarista.append("text")
            .attr("x", (x1 + x2) / 2)
            .attr("y", (y1 + y2) / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .text(arista.peso);
        */
        
    }

</script>