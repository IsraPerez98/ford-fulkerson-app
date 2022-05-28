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

    let aristas = [ //las aristas se toman como una matriz de adyacencia nxn con pesos 
        [0, 1, 0],
        [0, 0, 2],
        [400, 0, 0],
    ];

    let nodosARedibujar = []; //contiene los id de los nodos que se deben actualizar con d3

    function AgregarNodo(posX, posY) {
        let nodo = {
            id: nodos.length,
            nombre: "Nodo" + nodos.length,
            posX: posX,
            posY: posY,
        };

        nodos.push(nodo);

        //agregamos una dimension a la matriz de adyacencia
        for (let i = 0; i < aristas.length; i++) {
            aristas[i].push(0);
        }
        aristas.push(Array(aristas.length + 1).fill(0));
        //console.log({aristas});
        //nodos = nodos;
        nodosARedibujar = [nodo.id];
    }

    function moverNodo(id, posX, posY) {
        nodos[id].posX = posX;
        nodos[id].posY = posY;
        //nodos = nodos;
        //aristas = aristas;

        //tenemos que redibujar el nodo y todos los nodos adyacentes con peso distinto a 0
        nodosARedibujar = [id];

        //codigo feo, pero no se genera un bug de z-fighting
        for (let i = 0; i < aristas.length; i++) {
            if (aristas[id][i] != 0) {
                nodosARedibujar.push(i);
            }
        }
        for (let i = 0; i < aristas.length; i++) {
            if (aristas[i][id] != 0) {
                nodosARedibujar.push(i);
            }
        }

    }

    function cambiarPeso(desdeID, hastaID, peso) {
        aristas[desdeID][hastaID] = peso;

        //aristas = aristas;
        nodosARedibujar = [desdeID, hastaID];
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
        {#each aristas as desde, iddesde }
            {#each desde as hasta, idhasta}
                {#if hasta !== 0} 
                    <Arista 
                        svggrafo={svggrafo}
                        nodosARedibujar={nodosARedibujar}
                        arista={{
                            desde: nodos[iddesde],
                            hasta: nodos[idhasta],
                            peso: aristas[iddesde][idhasta],
                        }}
                        cambiarPeso={cambiarPeso}
                    />
                {/if}
            {/each}
        {/each}
        {#each nodos as nodo}
            <Nodo 
                svggrafo={svggrafo} 
                nodo={nodo} 
                nodosARedibujar={nodosARedibujar}
                moverNodo={moverNodo} 
            />
        {/each}
    </div>
</div>