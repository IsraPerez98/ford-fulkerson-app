<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";
    
    export let svggrafo: any;
    export let divComponente: any;

    export let agregarNodo: Function;
    
    const radio = 35;
    
    let sgvnodonuevo: any;

    let posicion = {
        x: 0,
        y: 0,
    };

    function obtenerPosicionDiv() {
        const posicionSVG = svggrafo.node().getBoundingClientRect();
        const posicionDIV = divComponente.node().getBoundingClientRect();

        return {
            x: posicionDIV.x - posicionSVG.x,
            y: posicionDIV.y - posicionSVG.y + radio,
        };
    }

    $: if(svggrafo && divComponente) {
        posicion = obtenerPosicionDiv();
        draw();
    }

    function moverNodo(event:any, d:any) {
        
        posicion.x = event.x;
        posicion.y = event.y;

        reposicionarNodo();
    }

    function soltarNodo(event:any, d:any) {
        agregarNodo(posicion.x, posicion.y);
        posicion = obtenerPosicionDiv();
        draw();
    }

    function reposicionarNodo() {
        sgvnodonuevo
            .attr("x", posicion.x - radio)
            .attr("y", posicion.y - radio);
    }

    function draw() {
        //console.log("Dibujando nuevo nodo");
        if(!svggrafo || !divComponente) {
            return;
        }

        if(sgvnodonuevo){
            sgvnodonuevo.remove();
        }

        sgvnodonuevo = svggrafo.append("svg")
            .attr("x", posicion.x - radio)
            .attr("y", posicion.y - radio)
            .attr("width", radio * 2)
            .attr("height", radio * 2)
            .call(d3.drag()
                .on("start", moverNodo)
                .on("drag", moverNodo)
                .on("end", soltarNodo));

        const fo = sgvnodonuevo.append("foreignObject")
            .attr("width", radio * 2)
            .attr("height", radio * 2);
            
        
        const divInterno = fo.append("xhtml:div")
            .attr("class", "cursor-pointer flex w-full h-full bg-blue-900 rounded-full border border-white/20 overflow:hidden");
        
        const text = divInterno.append("xhtml:p")
            .attr("class", "text-white text-xs text-center m-auto select-none")
            .text("Nuevo nodo");
    }
</script>