<script lang="ts">
    import { generarGrafoAlAzar } from './Funciones/GeneracionGrafo';

    import VerticeComponent from './Vertice/Vertice.svelte';
    import AristaComponent from './Arista/Arista.svelte';

    import type Vertice from '../../classes/Vertice';
    import type Grafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';

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

    console.log(grafo.matrizAdyacencia);

    aristas = grafo.aristas;
    vertices = grafo.vertices;


</script>

<div>
    <svg width={width} height={height} class="select-none">
        <svg height={height}>
            
            {#each aristas as aristasDeVertice}
                {#each aristasDeVertice as arista}
                    {#if arista}
                        <AristaComponent {arista} />
                    {/if}
                {/each}
            {/each}
            
            {#each vertices as vertice}
                <VerticeComponent {vertice} />
            {/each}
        </svg>
    </svg>
</div>