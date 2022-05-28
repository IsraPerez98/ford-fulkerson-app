<script lang="ts">
    import { onMount } from "svelte";
    import type Nodo from "../../../interfaces/Nodo";

    export let svgarista: any;
    export let offsetX: number;
    
    export let nodoDesde: Nodo;
    export let nodoHasta: Nodo;
    export let peso: number;

    export let bgColor: string;

    export let cambiarPeso: Function;

    let radiopeso = 20;

    $: if(svgarista) {
        draw();
    }

    onMount(() => {
        draw();
    });

    let fo: any;

    function cambioPeso() {
        const pesoActual = peso;

        const pesoNuevo = parseInt(this.value);
        
        //si el peso nuevo no es un numero no se cambia
        if(isNaN(pesoNuevo)) {
            console.log("Nuevo peso no es un numero valido");
            this.value = pesoActual;
            return;
        }

        const desdeID = nodoDesde.id;
        const hastaID = nodoHasta.id;

        cambiarPeso(desdeID, hastaID, pesoNuevo);
    }

    function draw() { //
        if(!svgarista) {
            return;
        }

        if(fo){
            fo.remove();
        }

        const x1 = nodoDesde.posX;
        const y1 = nodoDesde.posY;

        const x2 = nodoHasta.posX;
        const y2 = nodoHasta.posY;

        //dibujamos el peso con un foreign object
        //dibujamos el peso con un foreign object
        fo = svgarista.append("foreignObject")
            .attr("x", (x2 + x1)/2 - radiopeso + offsetX)
            .attr("y", (y1 + y2)/2 - radiopeso)
            .attr("width", radiopeso * 2)
            .attr("height", radiopeso * 2);
        
        const div = fo.append("xhtml:div")
            .attr("class", `flex w-full h-full ${bgColor} rounded-full border border-white/20`);
        /*
        const text = div.append("xhtml:p")
            .attr("class", "text-white text-center m-auto")
            .text(arista.peso);
        */

        const texto = div.append("xhtml:input")
            .attr("class", "w-full h-full text-white text-center m-auto bg-transparent border-none outline-none")
            .attr("type", "text")
            .attr("value", peso)
            .on("change", cambioPeso);
    }

</script>