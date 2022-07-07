<script lang="ts">
    import { onMount } from "svelte";

    import Menu from "./Menu/Menu.svelte";
    
    //import Nodo from "./Nodo/Nodo.svelte";
    //import Arista from "./Arista/Arista.svelte";

    let creandoArista = false;
    let eliminandoNodo = false;

    let nodos = [
    ];

    let aristas = [ //las aristas se toman como una matriz de adyacencia nxn con pesos 
        
    ];

    function generarGrafoAzar(cantNodos: number) {
        let nuevosNodos = [];
        for (let i = 0; i < cantNodos; i++) {
            nuevosNodos.push({
                id: i,
                nombre: null,
                fuente: (i == 0) ? true : false,
                sumidero: (i==cantNodos-1) ? true : false,
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
        console.log(aristas);

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

    let nodosNuevaArista: Set<number> = new Set();

    function toggleCreacionArista() {
        if(creandoArista) {
            nodosNuevaArista = new Set();
            creandoArista = false;
        } else {
            creandoArista = true;
        }
    }

    function seleccionarNodoNuevaArista(id) {
        nodosNuevaArista.add(id);
        if(nodosNuevaArista.size === 2) {
            crearNuevaArista(nodosNuevaArista);
            nodosNuevaArista = new Set();
            creandoArista = false;
        }
    }

    function crearNuevaArista(nodosNuevaArista: Set<number>) {
        const [nodo1, nodo2] = nodosNuevaArista;
        if(aristas[nodo2][nodo1] !== 0) {
            console.log("Ya existe una arista entre estos nodos");
            return;
        }
        aristas[nodo2][nodo1] = 1; //TODO: DEJAR QUE EL USUARIO SELECCIONE EL PESO
    }

    function toggleEliminacionNodo() {
        if(eliminandoNodo) {
            eliminandoNodo = false;
        } else {
            eliminandoNodo = true;
        }
    }

    function eliminarNodo(nodoID: number) {
        //restamos 1 al id de los nodos que son mayores que el eliminado
        for (let i = 0; i < nodos.length; i++) {
            if(nodos[i].id > nodoID) {
                nodos[i].id--;
            }
        }

        //eliminamos el nodo de la matriz de adyacencia
        for (let i = 0; i < aristas.length; i++) {
            aristas[i].splice(nodoID, 1);
        }
        aristas.splice(nodoID, 1);

        //eliminamos el nodo de la lista de nodos
        nodos.splice(nodoID, 1);

        eliminandoNodo = false;

    }

    let nodosMovidos: Set<number> = new Set(); //guarda los nodos que se han movido para poder actualizar las aristas

    function reposicionarAristas(nodoID: number) {
        nodosMovidos = new Set([nodoID]);
    }


    function cambiarPeso(desdeID, hastaID, peso) {
        aristas[desdeID][hastaID] = peso;
    }

</script>

<div>
    <Menu 
        agregarNodo={AgregarNodo}
        toggleCreacionArista={toggleCreacionArista}
        creandoArista={creandoArista}
        toggleEliminacionNodo={toggleEliminacionNodo}
        eliminandoNodo={eliminandoNodo}
    />
    <!--
    {#each aristas as grupo, i}
        {#each grupo.slice(0,i) as arista, j}
            {#if (aristas[i][j] !== 0 || aristas[j][i] !== 0)}
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
            creandoArista={creandoArista}
            seleccionarNodoNuevaArista={seleccionarNodoNuevaArista}
            eliminandoNodo={eliminandoNodo}
            eliminarNodo={eliminarNodo}
        />
    {/each}
    -->
</div>