<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    
    export let svggrafo: any;

    export let agregarNodo: Function;

    let divMenu: any;

    let moviendo = false;
    
    const radio = 35;
    
    let sgvnodonuevo: any;

    let posX = 0 + radio;
    let posY = 0 + radio;

    $: if(svggrafo || divMenu) {
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
        console.log("dibujando nuevo nodo");
        console.log({svggrafo, divMenu});
        if(!svggrafo || !divMenu) {
            return;
        }

        if(sgvnodonuevo){
            sgvnodonuevo.remove();
        }

        console.log("dibujando nuevo nodo xd");

        if (!moviendo) {
            posX = 0 + radio;
            posY = 0 + radio;
            //console.log({posX, posY});
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

<div bind:this={divMenu}>

</div>