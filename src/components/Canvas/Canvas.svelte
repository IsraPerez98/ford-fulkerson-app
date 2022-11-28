<script lang="ts">
    import { generarGrafoAlAzar } from '../../util/GeneracionGrafo';

    import Grafo from '../Grafo/Grafo.svelte';
    import Menu from '../Menu/Menu.svelte';
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

    function esPantallaMD() {
        return window.innerWidth < 768;
    }


</script>

<div class="bg-white dark:bg-gray-800">
    <svg width={width} height={height} class="select-none">

        <Grafo {aristas} {vertices} />

        <foreignObject width={esPantallaMD ? '2.5rem' : width } height={esPantallaMD ? height : '2.5rem'} class="h-full w-10 md:w-full md:h-10" >
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
        
    </svg>
</div>