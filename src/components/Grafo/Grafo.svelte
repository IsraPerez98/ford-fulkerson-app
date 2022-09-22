<script lang="ts">
    import {generarVertices, generarGrafoAlAzar} from "./Funciones";

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

    let aristas: TypeArista[] = [];

    matrizAdyacencia = generarGrafoAlAzar(5);
    //console.log(matrizAdyacencia);

    vertices = generarVertices(matrizAdyacencia, width, height);

</script>

<svg bind:this={bindSVG} width={width} height={height} class="select-none">
    
    <svg y="120" height={height - 120}> <!-- TODO: Mejorar margen y ajustar tamaño dinamicamente-->

        {#each vertices as vertice}
            <Vertice
                vertice={vertice} 
            />
        {/each}
    </svg>
</svg>