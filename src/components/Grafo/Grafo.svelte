<script lang="ts">
    import { generarGrafoAlAzar } from './Funciones/GeneracionGrafo';

    import Menu from './Menu/Menu.svelte';
    import VerticeComponent from './Vertice/Vertice.svelte';
    import AristaComponent from './Arista/Arista.svelte';

    import type Vertice from '../../classes/Vertice';
    import type Grafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';

    export let width: number ;
    export let height: number ;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    let grafo: Grafo;

    //estas funciones son necesarias para decirle a Svelte que re-renderice el componente
    function recargarAristas() {
        aristas = grafo.aristas;
    }

    function recargarVertices() {
        vertices = grafo.vertices;
    }

    function recargarGrafo() {
        grafo = grafo;
    }

    grafo = generarGrafoAlAzar(5, width, height, recargarVertices, recargarAristas, recargarGrafo);

    console.log(grafo.matrizAdyacencia);

    aristas = grafo.aristas;
    vertices = grafo.vertices;


</script>

<div>
    <svg width={width} height={height} class="select-none">
        <foreignObject width="100%" height="40px" >
            <Menu 
                grafo={grafo}
            />
        </foreignObject>

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