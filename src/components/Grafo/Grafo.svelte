<script lang="ts">
    import { generarGrafoAlAzar } from '../../util/GeneracionGrafo';

    import Menu from '../Menu/Menu.svelte';
    import GitHub from '../GitHub/GitHub.svelte';
    import ConsolaComponent from '../Consola/Consola.svelte';
    import VerticeComponent from './Vertice/Vertice.svelte';
    import AristaComponent from './Arista/Arista.svelte';

    import type Consola from '../../classes/Consola';
    import type Vertice from '../../classes/Vertice';
    import type Grafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';
    import { beforeUpdate } from 'svelte';

    export let width: number ;
    let prevWidth: number = width;
    export let height: number ;
    let prevHeight: number = width;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    let consola: Consola;
    let grafo: Grafo;

    beforeUpdate(() => {
        if(prevWidth != width || prevHeight != height) {
            prevWidth = width;
            prevHeight = height;
            
            grafo.cambiarTamanio(width, height);
        }
    });

    //esta funcion son necesarias para decirle a Svelte que re-renderice el componente
    function recargarGrafo() {
        if(!grafo) return;
        grafo = grafo;
        
        if (grafo.consola) consola = grafo.consola;
        if (grafo.vertices) vertices = grafo.vertices;
        if (aristas) aristas = grafo.aristas;
    }

    grafo = generarGrafoAlAzar(6, width, height, recargarGrafo);
    recargarGrafo();

    //console.log(grafo.matrizAdyacencia);

</script>

<div>
    <svg width={width} height={height} class="select-none">
        

        <svg height={height}>
            {#each Array(aristas.length) as _, i}
                {#each Array(i+1) as _, j}
                    {#if aristas[i][j] || aristas[j][i]}
                        <AristaComponent 
                            arista={aristas[i][j]}
                            aristaInversa={aristas[j][i]}
                        />
                    {/if}
                {/each}
            {/each}
            
            {#each vertices as vertice}
                <VerticeComponent {vertice} />
            {/each}
        </svg>

        <foreignObject width="100%" height="40px" >
            <Menu 
                grafo={grafo}
            />
        </foreignObject>

        <foreignObject width="100%" height="100%" class="pointer-events-none">
            {#if consola}
                <ConsolaComponent 
                    consola={consola}
                />
            {/if}
        </foreignObject>

        <foreignObject width="100%" height="100%" class="pointer-events-none">
            <GitHub />
        </foreignObject>
        
    </svg>
</div>