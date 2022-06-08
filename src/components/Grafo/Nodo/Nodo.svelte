<script lang="ts">
    import * as d3 from 'd3';
    import { onDestroy } from 'svelte';
    
    import type  Nodo  from '../../../interfaces/Nodo';

    export let svggrafo: any;
    export let nodo: Nodo;

    export let reposicionarAristas: Function;
    
    
    export let creandoArista: boolean;
    export let seleccionarNodoNuevaArista: Function;

    export let eliminandoNodo: boolean;
    export let eliminarNodo: Function;

    let svgnodo: any;

    let divnodo: any;

    $: nombre = (nodo.nombre) ? nodo.nombre : `Nodo ${nodo.id}` ;

    const radio = 35;
    let color = 'bg-blue-700';

    let seleccionadoNuevaArista = false;

    $: {

        let colorNuevo = 'bg-blue-700';

        if(nodo.fuente) {
            colorNuevo = 'bg-green-700';
        }

        if(nodo.sumidero) {
            colorNuevo = 'bg-red-800';
        }
        
        if(!(creandoArista)) {
            seleccionadoNuevaArista = false;
        }

        if(eliminandoNodo) {
            colorNuevo = 'bg-red-700';
        }

        if(creandoArista) {
            colorNuevo = 'bg-green-900';
        }

        if(seleccionadoNuevaArista) {
            colorNuevo = 'bg-yellow-700';
        }

        if(colorNuevo != color) {
            color = colorNuevo;
            setColor(color);
        }
    }

    function setColor(color: string) {
        if(divnodo) {
            divnodo.attr("class", `cursor-pointer flex w-full h-full ${color} rounded-full border border-white/20 overflow:hidden`);
        }
    }


    $: if(svggrafo) {
        draw();
    }


    function dragEvent(event:any, d:any) {
        if(creandoArista) {
            return;
        }

        nodo.x = event.x;
        nodo.y = event.y;

        svgnodo.attr("x", nodo.x - radio)
        .attr("y", nodo.y - radio);

        reposicionarAristas(nodo.id);
    }

    function onClick() {
        if(creandoArista) {
            seleccionadoNuevaArista = true;
            seleccionarNodoNuevaArista(nodo.id);
        } else if(eliminandoNodo) {
            eliminarNodo(nodo.id);
            if(svgnodo){
                svgnodo.remove();
            }
        }
    }

    function draw() {
        if(!svggrafo || !nodo) {
            return;
        }

        console.log("Dibujando nodo " + nodo.id);


        if(svgnodo){
            svgnodo.remove();
        }

        svgnodo = svggrafo.append("svg")
            .attr("width", radio * 2)
            .attr("height", radio * 2)
            .attr("x", nodo.x - radio)
            .attr("y", nodo.y - radio)
            .on("click", onClick)
            .call(d3.drag()
                .on("start", dragEvent)
                .on("drag", dragEvent)
                .on("end", dragEvent));
        
        const fo = svgnodo.append("foreignObject")
            .attr("width", radio * 2)
            .attr("height", radio * 2);
        
        divnodo = fo.append("xhtml:div")
            .attr("class", `cursor-pointer flex w-full h-full ${color} rounded-full border border-white/20 overflow:hidden`);
        
        const text = divnodo.append("xhtml:p")
            .attr("class", "text-white text-center m-auto select-none")
            .text(nombre);
    }
</script>