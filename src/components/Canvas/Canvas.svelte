<script lang="ts">
    import { generarGrafoAlAzar } from '../../util/GeneracionGrafo';

    import Grafo from '../Grafo/Grafo.svelte';
    import Menu from '../Menu/Menu.svelte';
    import GitHub from '../GitHub/GitHub.svelte';
    import ConsolaComponent from '../Consola/Consola.svelte';

    import type Consola from '../../classes/Consola';
    import type Vertice from '../../classes/Vertice';
    import type TypeGrafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';
    import { beforeUpdate } from 'svelte';

    export let width: number ;
    let prevWidth: number = width;
    export let height: number ;
    let prevHeight: number = width;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    let consola: Consola;
    let grafo: TypeGrafo;

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
        if (grafo.aristas) aristas = grafo.aristas;
    }

    grafo = generarGrafoAlAzar(6, width, height, recargarGrafo);
    recargarGrafo();


</script>

<div>
    <svg width={width} height={height} class="select-none">

        <Grafo {aristas} {vertices} />

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