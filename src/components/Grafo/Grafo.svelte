<script lang="ts">
    import { onMount } from "svelte";

    import Menu from "./Menu/Menu.svelte";

    import Vertice from "./Vertice/Vertice.svelte";
    import Arista from "./Arista/Arista.svelte";
    import { identity, is_function } from "svelte/internal";

    import type  TypeVertice  from '../../interfaces/Vertice';

    let creandoArista = false;
    let eliminandoVertice = false;

    let vertices: TypeVertice[] = [];

    let aristas: number[][] = []; //las aristas se toman como una matriz de adyacencia nxn con pesos 
    let red = aristas.map(a => [...a]); //se crea una copia de la matriz de adyacencia para el algoritmo de ford fulkerson

    let caminos: boolean[][] = []; // matriz "de adyacencia" que representan los caminos desde el origen al sumidero

    function limpiarCaminos() {
        let nuevosCaminos = new Array(vertices.length)
        for(let i = 0; i < vertices.length; i++) {
            nuevosCaminos[i] = new Array(vertices.length).fill(false);
        }

        caminos = nuevosCaminos;
    }

    limpiarCaminos();

    function generarGrafoAzar(cantVertices: number) {
        let nuevosVertices = [];
        for (let i = 0; i < cantVertices; i++) {
            nuevosVertices.push({
                id: i,
                nombre: null,
                fuente: (i == 0) ? true : false,
                sumidero: (i==cantVertices-1) ? true : false,
                x: Math.random() * 800,
                y: Math.random() * 700,
            });
        }
        //generamos aristas aleatorias
        let nuevasAristas = new Array(nuevosVertices.length);
        for (let i = 0; i < nuevasAristas.length; i++) {
            nuevasAristas[i] = new Array(nuevosVertices.length);
            for (let j = 0; j < nuevasAristas.length; j++) {
                if(Math.random() > 0.5) {
                    nuevasAristas[i][j] = Math.floor(Math.random() * 100);
                } else {
                    nuevasAristas[i][j] = 0;
                }
            }
        }

        vertices = nuevosVertices;
        aristas = nuevasAristas;
        red = aristas.map(a => [...a]);
        console.log(aristas);
        limpiarCaminos();

    }

    generarGrafoAzar(5);

    function AgregarVertice(posX, posY) {
        let vertice = {
            id: vertices.length,
            nombre: null,
            fuente: false,
            sumidero: false,
            x: posX,
            y: posY,
        };

        vertices.push(vertice);

        //agregamos una dimension a la matriz de adyacencia
        for (let i = 0; i < aristas.length; i++) {
            aristas[i].push(0);
        }
        aristas.push(Array(aristas.length + 1).fill(0));
        red = aristas.map(a => [...a]);
        //console.log({aristas});
        vertices = vertices;
        limpiarCaminos();
    }

    let verticesNuevaArista: Set<number> = new Set();

    function toggleCreacionArista() {
        if(creandoArista) {
            verticesNuevaArista = new Set();
            creandoArista = false;
        } else {
            creandoArista = true;
        }
    }

    function seleccionarVerticeDeNuevaArista(id) {
        verticesNuevaArista.add(id);
        if(verticesNuevaArista.size === 2) {
            crearNuevaArista(verticesNuevaArista);
            verticesNuevaArista = new Set();
            creandoArista = false;
        }
    }

    function crearNuevaArista(verticesNuevaArista: Set<number>) {
        const [vertice1, vertice2] = verticesNuevaArista;
        if(aristas[vertice2][vertice1] !== 0) {
            console.log("Ya existe una arista entre estos vertices");
            return;
        }
        aristas[vertice2][vertice1] = 1; //TODO: DEJAR QUE EL USUARIO SELECCIONE EL PESO
        red = aristas.map(a => [...a]);
        limpiarCaminos();
    }

    function toggleEliminacionVertice() {
        if(eliminandoVertice) {
            eliminandoVertice = false;
        } else {
            eliminandoVertice = true;
        }
    }

    function eliminarVertice(verticeID: number) {
        //restamos 1 al id de los vertices que son mayores que el eliminado
        for (let i = 0; i < vertices.length; i++) {
            if(vertices[i].id > verticeID) {
                vertices[i].id--;
            }
        }

        //eliminamos el vertice de la matriz de adyacencia
        for (let i = 0; i < aristas.length; i++) {
            aristas[i].splice(verticeID, 1);
        }
        aristas.splice(verticeID, 1);

        //eliminamos el vertice de la lista de vertices
        vertices.splice(verticeID, 1);
        
        red = aristas.map(a => [...a]);

        limpiarCaminos();

        eliminandoVertice = false;

    }

    let verticesMovidos: Set<number> = new Set(); //guarda los vertices que se han movido para poder actualizar las aristas

    function reposicionarAristas(verticeID: number) {
        verticesMovidos = new Set([verticeID]);
    }


    function cambiarPeso(desdeID, hastaID, peso) {
        aristas[desdeID][hastaID] = peso;
        red = aristas.map(a => [...a]);
        limpiarCaminos();
    }

    function DFSRecursivo(red, verticeID: number, destino: number, visitados: Array<boolean>, camino: Array<TypeVertice>) {
        visitados[verticeID] = true;
        if(verticeID === destino) {
            return [...camino,vertices[verticeID]];
        }
        for (let i = 0; i < red[verticeID].length; i++) {
            if(red[i][verticeID] !== 0 && !visitados[i]) {
                const c = DFSRecursivo(red, i, destino, visitados, [...camino,vertices[verticeID]]);
                if(c) {
                    return c;
                }
            }
        }
        return null;
    }

    function dibujarCamino(camino: TypeVertice[]) {
        for (let i = 0; i < camino.length - 1; i++) {
            caminos[camino[i].id][camino[i+1].id] = true;
        }        
    }

    function buscarCamino(red: Array<Array<number>>, fuente: TypeVertice, destino: TypeVertice) : Array<TypeVertice> {
        //DFS
        let visitados = new Array(vertices.length).fill(false);

        let camino = [];

        camino = DFSRecursivo(red, fuente.id, destino.id, visitados, camino);

        return camino;
    }

    function FlujoMaximo(fuente: TypeVertice, destino: TypeVertice): number {
        let flujomaximo = 0;
        red = aristas.map(a => [...a]);
        //console.log({red});
        while(true) {
            const camino = buscarCamino(red, fuente, destino);
            if(!camino) {
                console.log({flujomaximo});
                alert("Flujo maximo: " + flujomaximo);
                return flujomaximo;
            }
            dibujarCamino(camino);
            //console.log({camino});
            //calculamos el flujo minimo del camino encontrado
            let flujominimo = Infinity;
            for (let i = 0; i < camino.length - 1; i++) {
                const flujocamino = red[camino[i+1].id][camino[i].id];
                if(flujocamino < flujominimo) {
                    flujominimo = flujocamino;
                }
            }
            flujomaximo += flujominimo;
            //console.log(flujominimo);
            //actualizamos el flujo de la red
            for (let i = 0; i < camino.length - 1; i++) {
                red[camino[i+1].id][camino[i].id] -= flujominimo;
            }
            //console.log(red);
        }
    }

</script>

<button on:click={() => {FlujoMaximo(vertices[0], vertices[4])}}>Flujo Maximo</button>

<svg height="800" width="800">
    
    <Menu 
        agregarVertice={AgregarVertice}
        toggleCreacionArista={toggleCreacionArista}
        creandoArista={creandoArista}
        toggleEliminacionVertice={toggleEliminacionVertice}
        eliminandoVertice={eliminandoVertice}
    />
    
    <svg y="100"> <!-- TODO: Mejorar margen y ajustar tamaño dinamicamente-->

        {#each aristas as grupo, i}
            {#each grupo.slice(0,i) as arista, j}
                {#if (aristas[i][j] !== 0 || aristas[j][i] !== 0)}
                    <Arista
                        arista={{
                            origen: vertices[i],
                            destino: vertices[j],
                            esCamino: [ caminos[j][i], caminos[i][j] ],
                            peso: [aristas[i][j] , aristas[j][i]],
                            flujo: [aristas[i][j] - red[i][j], aristas[j][i] - red[j][i]],
                        }}
                        verticesMovidos={verticesMovidos}
                        cambiarPeso={cambiarPeso}
                    />
                {/if}
            {/each}
        {/each}

        
        {#each vertices as vertice}
            <Vertice  
                vertice={vertice} 
                reposicionarAristas={reposicionarAristas}
                creandoArista={creandoArista}
                seleccionarVerticeDeNuevaArista={seleccionarVerticeDeNuevaArista}
                eliminandoVertice={eliminandoVertice}
                eliminarVertice={eliminarVertice}
            />
        {/each}
    </svg>
</svg>