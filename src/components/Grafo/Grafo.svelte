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
            x: 600,
            y: 50,
        },
        {
            id: 1,
            nombre: "test2",
            x: 100,
            y: 200,
        },
        {
            id: 2,
            nombre: "test3",
            x: 500,
            y: 300,
        },
    ]

    let aristas = [ //las aristas se toman como una matriz de adyacencia nxn con pesos 
        [0, 1, 20],
        [0, 0, 0],
        [400, 2, 0],
    ];

    function generarGrafoAzar(cantNodos: number) {
        let nuevosNodos = [];
        for (let i = 0; i < cantNodos; i++) {
            nuevosNodos.push({
                id: i,
                nombre: "nodo" + i,
                x: Math.random() * 800,
                y: Math.random() * 800,
            });
        }
        //generamos aristas aleatorias
        let nuevasAristas = new Array(nuevosNodos.length);
        for (let i = 0; i < nuevasAristas.length; i++) {
            nuevasAristas[i] = new Array(nuevosNodos.length);
            for (let j = 0; j < nuevasAristas.length; j++) {
                if(Math.random() > 0.5) {
                    nuevasAristas[i][j] = Math.floor(Math.random() * 100);
                } else {
                    nuevasAristas[i][j] = 0;
                }
            }
        }

        nodos = nuevosNodos;
        aristas = nuevasAristas;
        //console.log(aristas);

    }

    generarGrafoAzar(6);

    function AgregarNodo(posX, posY) {
        let nodo = {
            id: nodos.length,
            nombre: "Nodo" + nodos.length,
            x: posX,
            y: posY,
        };

        nodos.push(nodo);

        //agregamos una dimension a la matriz de adyacencia
        for (let i = 0; i < aristas.length; i++) {
            aristas[i].push(0);
        }
        aristas.push(Array(aristas.length + 1).fill(0));
        //console.log({aristas});
        nodos = nodos;
    }

    let nodosMovidos: Set<Number> = new Set(); //guarda los nodos que se han movido para poder actualizar las aristas

    function reposicionarAristas(nodoID: number) {
        nodosMovidos = new Set([nodoID]);
    }


    function cambiarPeso(desdeID, hastaID, peso) {
        aristas[hastaID][desdeID] = peso;
    }

    onMount(() => {
        draw();
    });


    function draw() {
        //console.log("Dibujando canvas");
        const canvas = d3.select(bindcanvas);

        //canvas.html(null); //borrar todo

        svggrafo = canvas.append('svg')
            .attr('width', 800)
            .attr('height', 800)
    }
</script>

<div>
    <div bind:this={bindcanvas}>
        <Menu svggrafo={svggrafo} agregarNodo={AgregarNodo}/>
        {#each Array(aristas.length) as _, i}
            {#each Array(i) as _, j}
                {#if aristas[i][j] !== 0 || aristas[j][i] !== 0}
                    <Arista 
                        svggrafo={svggrafo}
                        arista={{
                            origen: nodos[i],
                            destino: nodos[j],
                            peso: [aristas[i][j] , aristas[j][i]],
                        }}
                        nodosMovidos={nodosMovidos}
                        cambiarPeso={cambiarPeso}
                    />
                {/if}
            {/each}
        {/each}
        {#each nodos as nodo}
            <Nodo 
                svggrafo={svggrafo} 
                nodo={nodo} 
                reposicionarAristas={reposicionarAristas}
            />
        {/each}
    </div>
</div>