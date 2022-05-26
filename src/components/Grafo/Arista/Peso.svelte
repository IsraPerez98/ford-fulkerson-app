<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../../interfaces/Arista";

    export let svgarista: any;
    export let arista: Arista;
    export let cambiarPeso: Function;

    let radiopeso = 20;

    $: if(svgarista && arista) {
        draw();
    }

    onMount(() => {
        draw();
    });

    let fo: any;

    function cambioPeso() {
        const id = arista.id;
        const pesoActual = arista.peso;

        const pesoNuevo = parseInt(this.value);
        
        //si el peso nuevo no es un numero no se cambia
        if(isNaN(pesoNuevo)) {
            console.log("Nuevo peso no es un numero valido");
            this.value = pesoActual;
            return;
        }

        cambiarPeso(id, pesoNuevo);
    }

    function draw() {
        if(!svgarista || !arista) {
            return;
        }

        if(fo){
            fo.remove();
        }

        const x1 = arista.desde.posX;
        const y1 = arista.desde.posY;

        const x2 = arista.hasta.posX;
        const y2 = arista.hasta.posY;

        //dibujamos el peso con un foreign object
        //dibujamos el peso con un foreign object
        fo = svgarista.append("foreignObject")
            .attr("x", (x2 + x1)/2 - radiopeso)
            .attr("y", (y1 + y2)/2 - radiopeso)
            .attr("width", radiopeso * 2)
            .attr("height", radiopeso * 2);
        
        const div = fo.append("xhtml:div")
            .attr("class", "flex w-full h-full bg-rose-900 rounded-full border border-white/20");
        /*
        const text = div.append("xhtml:p")
            .attr("class", "text-white text-center m-auto")
            .text(arista.peso);
        */

        const texto = div.append("xhtml:input")
            .attr("class", "w-full h-full text-white text-center m-auto bg-transparent border-none outline-none")
            .attr("type", "text")
            .attr("value", arista.peso)
            .on("change", cambioPeso);
    }

</script>