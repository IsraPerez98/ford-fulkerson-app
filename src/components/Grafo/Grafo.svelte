<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from 'd3';
    
    import Nodo from "./Nodo/Nodo.svelte";
    import Arista from "./Arista/Arista.svelte";

    let bindcanvas;

    let svggrafo;

    let nodos = [
        {
            id: 0,
            nombre: "test",
            posX: 30,
            posY: 30,
        },
        {
            id: 1,
            nombre: "test2",
            posX: 100,
            posY: 200,
        },
        {
            id: 2,
            nombre: "test3",
            posX: 500,
            posY: 300,
        },
    ]

    let aristas = [
        {
            id: 1,
            desde: nodos[0],
            hasta: nodos[1],
            peso: 1,
        },
        {
            id: 2,
            desde: nodos[1],
            hasta: nodos[2],
            peso: 2,
        },
        {
            id: 3,
            desde: nodos[2],
            hasta: nodos[0],
            peso: 400,
        },
    ];

    function moverNodo(id, posX, posY) {
        nodos[id].posX = posX;
        nodos[id].posY = posY;
        nodos = nodos;
        aristas =aristas;
    }

    onMount(() => {
        draw();
    });

    

    function draw() {
        const canvas = d3.select(bindcanvas);

        canvas.html(null); //borrar todo

        svggrafo = canvas.append('svg')
            .attr('width', 800)
            .attr('height', 800)
    }
</script>

<main>
    <div bind:this={bindcanvas}>
        {#each aristas as arista }
            <Arista svggrafo={svggrafo} arista={arista} />
        {/each}
        {#each nodos as nodo}
            <Nodo svggrafo={svggrafo} nodo={nodo} moverNodo={moverNodo} />
        {/each}
    </div>
</main>