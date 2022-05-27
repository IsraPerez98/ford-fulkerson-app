<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from 'd3';

    import Menu from "./Menu/Menu.svelte";
    
    import Nodo from "./Nodo/Nodo.svelte";
    import Arista from "./Arista/Arista.svelte";

    let bindcanvas;

    let svggrafo;

    let nodos = [
        {
            id: 0,
            nombre: "test",
            posX: 600,
            posY: 50,
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
            id: 0,
            desde: nodos[0],
            hasta: nodos[1],
            peso: 1,
        },
        {
            id: 1,
            desde: nodos[1],
            hasta: nodos[2],
            peso: 2,
        },
        {
            id: 2,
            desde: nodos[2],
            hasta: nodos[0],
            peso: 400,
        },
    ];

    function AgregarNodo(posX, posY) {
        let nodo = {
            id: nodos.length,
            nombre: "Nodo" + nodos.length,
            posX: posX,
            posY: posY,
        };

        nodos.push(nodo);
        nodos = nodos;
    }

    function moverNodo(id, posX, posY) {
        nodos[id].posX = posX;
        nodos[id].posY = posY;
        nodos = nodos;
        aristas = aristas;
    }

    function cambiarPeso(id, peso) {
        aristas[id].peso = peso;
        nodos = nodos;
        aristas = aristas;
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

<div>
    <div bind:this={bindcanvas}>
        <Menu svggrafo={svggrafo} agregarNodo={AgregarNodo}/>
        {#each aristas as arista }
            <Arista svggrafo={svggrafo} arista={arista} cambiarPeso={cambiarPeso} />
        {/each}
        {#each nodos as nodo}
            <Nodo svggrafo={svggrafo} nodo={nodo} moverNodo={moverNodo} />
        {/each}
    </div>
</div>