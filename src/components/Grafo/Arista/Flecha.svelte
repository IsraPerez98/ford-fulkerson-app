<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../../interfaces/Arista";

    export let arista: Arista;
    export let svgarista: any;

    let svgflecha; 
    
    $: if(svgarista && arista) {
        draw();
    }

    onMount(() => {
        draw();
    });

    function draw() {
        console.log("dibujando flecha");
        if(!svgarista || !arista) {
            return;
        }

        if(svgflecha){
            svgflecha.remove();
        }

        //calculamos la posicion en el nodo de destino, restando el radio
        const x1 = arista.desde.posX;
        const y1 = arista.desde.posY;

        const x2 = arista.hasta.posX;
        const y2 = arista.hasta.posY;

        //calculamos el angulo de la flecha
        //ni idea por que esto funciona con PI/2, pero funciona
        const angulo = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;

        const angulodeg = angulo * 180 / Math.PI;

        //calculamos el angulo inverso como vector con la magnitud del radio
        const radioNodo = 35;

        //ni idea por que esto funciona con PI/2, pero funciona
        const anguloInverso = angulo + Math.PI /2;

        const x = x2 + radioNodo * Math.cos(anguloInverso);
        const y = y2 + radioNodo * Math.sin(anguloInverso);

        const flecha = svgarista.append("polygon")
            .attr("class", "fill-indigo-500")
            .attr("points", "-15,25 0,0 15,25, 0,15")
            //ponerla al medio y rotarla
            //.attr("transform", `translate( ${(x2 + x1)/2} , ${ (y2 + y1)/2} ) rotate(${angulodeg})`);
            //mejor ponerla casi al final
            .attr("transform", `translate( ${x}, ${y} ) rotate(${angulodeg})`);
    }
</script>