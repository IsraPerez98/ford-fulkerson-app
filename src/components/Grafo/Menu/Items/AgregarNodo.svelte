<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    
    export let svggrafo: any;

    export let agregarNodo: Function;

    let moviendo = false;
    
    const radio = 35;

    let div: any;
    
    let sgvnodonuevo: any;

    let posDiv;

    let posX = 0;
    let posY = 0;

    function obtenerPosicionDiv() {
        posDiv = div.getBoundingClientRect();

        posX = posDiv.x + radio;
        posY = posDiv.y + radio;
    }

    $: if(svggrafo || div) {
        draw();
    }

    onMount(() => {
        draw();
    });

    function moverNodo(event:any, d:any) {
        
        moviendo = true;
        
        posX = event.x;
        posY = event.y;
        draw();
    }

    function soltarNodo(event:any, d:any) {
        moviendo = false;
        agregarNodo(posX, posY);
        draw();
    }

    function draw() {
        //console.log("dibujando nuevo nodo");
        if(!svggrafo || !div) {
            return;
        }

        if(sgvnodonuevo){
            sgvnodonuevo.remove();
        }

        if (!moviendo) {
            obtenerPosicionDiv();
        }

        sgvnodonuevo = svggrafo.append("svg")
            .call(d3.drag()
                .on("start", moverNodo)
                .on("drag", moverNodo)
                .on("end", soltarNodo));

        const fo = sgvnodonuevo.append("foreignObject")
            .attr("x", posX - radio)
            .attr("y", posY - radio)
            .attr("width", radio * 2)
            .attr("height", radio * 2);
        
        const divInterno = fo.append("xhtml:div")
            .attr("class", "cursor-pointer flex w-full h-full bg-blue-900 rounded-full border border-white/20 overflow:hidden");
        
        const text = divInterno.append("xhtml:p")
            .attr("class", "text-white text-xs text-center m-auto select-none")
            .text("Nuevo nodo");
        //TODO: DAR A ENTENDER QUE SE ARRASTRA
        

    }
</script>

<div bind:this={div}>

</div>