<script lang="ts">
    import {generarVertices, generarAristas, generarFunciones, generarGrafoAlAzar} from "./Funciones";

    import Menu from "./Menu/Menu.svelte";

    import Vertice from "./Vertice/Vertice.svelte";
    import Arista from "./Arista/Arista.svelte";

    import type MatrizAdyacencia from "../../interfaces/MatrizAdyacencia";
    import type  TypeVertice  from '../../interfaces/Vertice';
    import type TypeArista  from '../../interfaces/Arista';

    export let width: number ;
    export let height: number ;

    const verticeRadio = 35;

    let bindSVG: SVGSVGElement;

    function getPosicionSVG() {
        //console.log({bindSVG});
        if(!bindSVG) return {x: 0, y: 0};

        const { x, y } = bindSVG.getBoundingClientRect();
        return { x, y };
    }

    let matrizAdyacencia: MatrizAdyacencia = [];

    let vertices: TypeVertice[] = [];
    let fuentes: boolean[] = [];
    let sumideros: boolean[] = [];

    let aristas: TypeArista[][] = [];

    ({ matrizAdyacencia, fuentes, sumideros } = generarGrafoAlAzar(5));

    console.log(matrizAdyacencia);

    vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, width, height);

    aristas = generarAristas(matrizAdyacencia, vertices);

    function recargarAristas() {
        aristas = aristas;
    }

    function recargarVertices() {
        vertices = vertices;
    }

    generarFunciones(vertices, recargarAristas, recargarVertices, width, height);

</script>

<svg bind:this={bindSVG} width={width} height={height} class="select-none">
    
    <svg height={height}>

        {#each aristas as aristasDeVertice}
            {#each aristasDeVertice as arista}
                <Arista
                    bind:arista={arista}
                />
            {/each}
        {/each}

        {#each vertices as vertice}
            <Vertice
                bind:vertice={vertice} 
            />
        {/each}
    </svg>
</svg>