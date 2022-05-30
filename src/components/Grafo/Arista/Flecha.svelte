<script lang="ts">
    import { onMount } from "svelte";

    export let svgarista: any;

    export let posicion: { x: number; y: number };
    export let angulo: number;

    export let fillColor: string;

    let poligonflecha; 

    onMount(() => {
        draw();
    });
    
    $: if(svgarista) {
        draw();
    }

    $: if(posicion || angulo) {
        if(svgarista) {
            reposicionarFlecha();
        }
    }

    function reposicionarFlecha() {
        const angulodeg = angulo * 180 / Math.PI;
        poligonflecha
            .attr("transform", `translate( ${posicion.x}, ${posicion.y} ) rotate(${angulodeg})`);
    }

    function draw() {
        //console.log("dibujando flecha");
        if(!svgarista) {
            return;
        }

        if(poligonflecha){
            poligonflecha.remove();
        }

        const angulodeg = angulo * 180 / Math.PI;

        poligonflecha = svgarista.append("polygon")
            .attr("class", `${fillColor}`)
            .attr("points", "-15,25 0,0 15,25, 0,15")
            //ponerla al medio y rotarla
            //.attr("transform", `translate( ${(x2 + x1)/2} , ${ (y2 + y1)/2} ) rotate(${angulodeg})`);
            //mejor ponerla casi al final
            .attr("transform", `translate( ${posicion.x}, ${posicion.y} ) rotate(${angulodeg})`);
    }
</script>