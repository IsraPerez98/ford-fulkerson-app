<script lang="ts">
    import { generarGrafoAlAzar } from '../../util/GeneracionGrafo';

    import Grafo from '../Grafo/Grafo.svelte';
    import Menu from '../Menu/Menu.svelte';
    import ConsolaComponent from '../Consola/Consola.svelte';

    import type Consola from '../../classes/Consola';
    import type Vertice from '../../classes/Vertice';
    import type TypeGrafo from '../../classes/Grafo';
    import type Arista from '../../classes/Arista';

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    let aristas: Arista[][] = [];
    let vertices: Vertice[] = [];

    let consola: Consola;
    let grafo: TypeGrafo;

    function esPantallaMD() {
        return windowWidth < 768;
    }

    function convertRemToPixels(rem) : number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    const margenMenu = convertRemToPixels(2.5);
    const margenConsola = convertRemToPixels(3);

    let grafoWidth: number;
    let grafoHeight: number;
    let grafoX: number;
    let grafoY: number;


    function calcularDimensionesGrafo() : void {
        grafoWidth = windowWidth - (esPantallaMD() ? margenMenu : 0 );
        grafoHeight = windowHeight - (esPantallaMD() ? margenConsola : 0 ) ;
    }
    calcularDimensionesGrafo();

    function calcularPosicionGrafo() : void {
        grafoX = esPantallaMD() ? margenMenu : 0;
        grafoY = 0;

        console.log({grafoX, grafoY});
    }
    calcularPosicionGrafo();

    function actualizarTamanioGrafo() {
        calcularDimensionesGrafo();
        calcularPosicionGrafo();
        
        grafo.cambiarTamanio({
            width: grafoWidth,
            height: grafoHeight,
            posicion: {
                x: grafoX,
                y: grafoY
            }
        });
    }

    //esta funcion son necesarias para decirle a Svelte que re-renderice el componente
    function recargarGrafo() {
        if(!grafo) return;
        grafo = grafo;
        
        if (grafo.consola) consola = grafo.consola;
        if (grafo.vertices) vertices = grafo.vertices;
        if (grafo.aristas) aristas = grafo.aristas;
    }

    grafo = generarGrafoAlAzar(6, grafoWidth, grafoHeight, recargarGrafo);
    recargarGrafo();
    actualizarTamanioGrafo();

</script>

<svelte:window on:resize={() => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    actualizarTamanioGrafo();
}} />

<div class="bg-white dark:bg-gray-800">
    <svg width={windowWidth} height={windowHeight} class="select-none">

        <Grafo 
            {aristas} 
            {vertices} 
            x={grafoX}
            y={grafoY}
            width={grafoWidth}
            height={grafoHeight}
        />

        <foreignObject width={esPantallaMD() ? margenMenu : windowWidth } height={esPantallaMD() ? windowHeight : margenMenu} class="h-full w-10 md:w-full md:h-10" >
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