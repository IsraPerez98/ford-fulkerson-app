<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../../interfaces/Arista";

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";

    export let svggrafo: any;
    export let nodosARedibujar: Array<number>;
    export let arista: Arista;
    export let cambiarPeso: Function;

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

        if(nodosARedibujar.length > 0 && !(nodosARedibujar.includes(arista.desde.id)) && !(nodosARedibujar.includes(arista.hasta.id))) {
            return;
        }

        //console.log("Dibujando arista " + arista.desde.id + " - " + arista.hasta.id);

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

        //la linea
        const line = svgarista.append("line")
            .attr("class", "stroke-teal-500 stroke-2")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)

    }

</script>

<div>
    <Flecha arista={arista} svgarista={svgarista} />
    <Peso arista={arista} svgarista={svgarista} cambiarPeso={cambiarPeso} />
</div>