<script lang="ts">
    import * as d3 from 'd3';
    
    import type  Nodo  from '../../../interfaces/Nodo';

    export let svggrafo: any;
    export let nodo: Nodo;

    export let reposicionarAristas: Function;

    let svgnodo: any;

    const radio = 35;

    $: if(svggrafo) {
        draw();
    }


    function dragEvent(event:any, d:any) {
        nodo.x = event.x;
        nodo.y = event.y;

        svgnodo.attr("x", nodo.x - radio)
        .attr("y", nodo.y - radio);

        reposicionarAristas(nodo.id);
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
            .call(d3.drag()
                .on("start", dragEvent)
                .on("drag", dragEvent)
                .on("end", dragEvent))
        
        const fo = svgnodo.append("foreignObject")
            .attr("width", radio * 2)
            .attr("height", radio * 2);
        
        const div = fo.append("xhtml:div")
            .attr("class", "cursor-pointer flex w-full h-full bg-blue-900 rounded-full border border-white/20 overflow:hidden");
        
        const text = div.append("xhtml:p")
            .attr("class", "text-white text-center m-auto select-none")
            .text(nodo.nombre);
    }
</script>