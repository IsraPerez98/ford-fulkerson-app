<script lang="ts">
    import { onMount } from "svelte";
    import Nodo from "./nodo.svelte";
    import Arista from "./arista.svelte";

    export let svggrafo: any;

    $: if(svggrafo) {
        draw();
    }

    let nodos = [
        {
            id: 1,
            nombre: "test",
            color: "red",
            posX: 30,
            posY: 30,
        },
        {
            id: 2,
            nombre: "test2",
            color: "blue",
            posX: 100,
            posY: 200,
        },
        {
            id: 3,
            nombre: "test3",
            color: "green",
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
            color: "red",
        },
        {
            id: 2,
            desde: nodos[1],
            hasta: nodos[2],
            peso: 2,
            color: "blue",
        },
        {
            id: 3,
            desde: nodos[2],
            hasta: nodos[0],
            peso: 400,
            color: "green",
        },
    ];

    async function moverAzar() {
        while (false) {
            for (const nodo of nodos) {
                nodo.posX += Math.random() * 5 - 2.5;
                nodo.posY += Math.random() * 5 - 2.5;
                nodos = nodos;
                aristas = aristas;
            }
            //sleep for 1 s
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    onMount(() => {
        draw();
        moverAzar();
    });

    

    function draw() {
        if(!svggrafo) {
            return;
        }
        svggrafo.html(null); //borrar todo
    }
</script>

<main>
    {#each aristas as arista }
        <Arista svggrafo={svggrafo} arista={arista} />
    {/each}
    {#each nodos as nodo}
        <Nodo svggrafo={svggrafo} nodo={nodo} />
    {/each}
</main>