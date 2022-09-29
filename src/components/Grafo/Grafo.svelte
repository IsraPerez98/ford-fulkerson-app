<script lang="ts">
    import { generarGrafoAlAzar } from './Funciones/GeneracionGrafo';

    import VerticeComponent from './Vertice/Vertice.svelte';

    import type Grafo from '../../interfaces/Grafo';
    import type Vertice from '../../interfaces/Vertice';
    import type Arista from '../../interfaces/Arista';

    export let width: number ;
    export let height: number ;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    function recargarAristas() {
        aristas = aristas;
    }

    function recargarVertices() {
        vertices = vertices;
    }

    let grafo: Grafo = generarGrafoAlAzar(5, width, height, recargarVertices, recargarAristas);

    aristas = grafo.aristas;
    vertices = grafo.vertices;


</script>

<div>
    <svg width={width} height={height} class="select-none">
        <svg height={height}>
            {#each vertices as vertice}
                <VerticeComponent {vertice} />
            {/each}
        </svg>
    </svg>
</div>