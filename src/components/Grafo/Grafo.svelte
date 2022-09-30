<script lang="ts">
    import { generarGrafoAlAzar } from './Funciones/GeneracionGrafo';

    import Menu from './Menu/Menu.svelte';
    import ConsolaComponent from './Consola/Consola.svelte';
    import VerticeComponent from './Vertice/Vertice.svelte';
    import AristaComponent from './Arista/Arista.svelte';

    import type Consola from '../../classes/Consola';
    import type Vertice from '../../classes/Vertice';
    import type Grafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';

    export let width: number ;
    export let height: number ;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    let consola: Consola;
    let grafo: Grafo;

    //esta funcion son necesarias para decirle a Svelte que re-renderice el componente
    function recargarGrafo() {
        if(!grafo) return;
        grafo = grafo;
        
        if (grafo.consola) consola = grafo.consola;
        if (grafo.vertices) vertices = grafo.vertices;
        if (aristas) aristas = grafo.aristas;
    }

    grafo = generarGrafoAlAzar(5, width, height, recargarGrafo);
    recargarGrafo();

</script>

<div>
    <svg width={width} height={height} class="select-none">
        <foreignObject width={"100%"} height={"100%"}>
            {#if consola}
                <ConsolaComponent 
                    consola={consola}
                />
            {/if}
        </foreignObject>

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