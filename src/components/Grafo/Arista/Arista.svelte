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

        //si dibujamos la arista desde (x1, y1) hasta (x2, y2)
        //aveces se dibuja por sobre los nodos
        //por lo tanto debemos calcular el borde del nodo para empezar a dibujar la linea
        //y no por encima de los nodos

        /*
        const x1 = arista.desde.posX;
        const y1 = arista.desde.posY;

        const x2 = arista.hasta.posX;
        const y2 = arista.hasta.posY;
        */

        const radioNodo = 35;
        
        
        //calculamos el angulo de la linea
        const angulo = Math.atan2(arista.hasta.posY - arista.desde.posY, arista.hasta.posX - arista.desde.posX);

        const x1 = arista.desde.posX + radioNodo * Math.cos(angulo);
        const y1 = arista.desde.posY + radioNodo * Math.sin(angulo);

        const x2 = arista.hasta.posX - radioNodo * Math.cos(angulo);
        const y2 = arista.hasta.posY - radioNodo * Math.sin(angulo);
        

        svgarista = svggrafo.append("svg")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2);

        //la linea
        if( arista.peso !== 0 && arista.pesoInverso == 0) {
            const linea = svgarista.append("line")
                .attr("class", "stroke-emerald-500 stroke-2")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        } else if ( arista.pesoInverso !== 0 && arista.peso == 0 ) {
            const linea = svgarista.append("line")
                .attr("class", "stroke-rose-500 stroke-2")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);
        } else if (arista.pesoInverso !== 0 && arista.peso !== 0) {
            const linea2 = svgarista.append("line")
                .attr("class", "stroke-emerald-500 stroke-2")
                .attr("x1", (x2 + x1) / 2)
                .attr("y1", (y2 + y1) / 2)
                .attr("x2", x2)
                .attr("y2", y2);

            const linea = svgarista.append("line")
                .attr("class", "stroke-rose-500 stroke-2")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", (x2 + x1) / 2)
                .attr("y2", (y2 + y1) / 2);
        }

    }

</script>

<div>
    
    {#if arista.peso !== 0}
        <Flecha
            svgarista={svgarista}
            nodoDesde={arista.desde}
            nodoHasta={arista.hasta}
            fillColor={'fill-emerald-800'}
        />
    {/if}
    {#if arista.pesoInverso !== 0}
        <Flecha
            svgarista={svgarista}
            nodoDesde={arista.hasta}
            nodoHasta={arista.desde}
            fillColor={'fill-rose-800'}
        />
    {/if}





    {#if arista.peso !== 0 && arista.pesoInverso == 0}
        <Peso
            svgarista={svgarista}
            offsetX={0}
            nodoDesde={arista.desde}
            nodoHasta={arista.hasta}
            peso={arista.peso}
            bgColor={'bg-emerald-800'}
            cambiarPeso={cambiarPeso}
        />
    {:else if arista.pesoInverso !== 0 && arista.peso == 0}
        <Peso
            svgarista={svgarista}
            offsetX={0}
            nodoDesde={arista.hasta}
            nodoHasta={arista.desde}
            peso={arista.pesoInverso}
            bgColor={'bg-rose-800'}
            cambiarPeso={cambiarPeso}
        />
    {:else if arista.pesoInverso !== 0 && arista.peso !== 0}
        <Peso
            svgarista={svgarista}
            offsetX={-20}
            nodoDesde={arista.desde}
            nodoHasta={arista.hasta}
            peso={arista.peso}
            bgColor={'bg-emerald-800'}
            cambiarPeso={cambiarPeso}
        />
        <Peso
            svgarista={svgarista}
            offsetX={20}
            nodoDesde={arista.hasta}
            nodoHasta={arista.desde}
            peso={arista.pesoInverso}
            bgColor={'bg-rose-800'}
            cambiarPeso={cambiarPeso}
        />
    {/if}
    
</div>