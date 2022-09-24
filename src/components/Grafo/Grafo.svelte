<script lang="ts">
    import {generarVertices, generarAristas, generarGrafoAlAzar, dibujarCamino as dibujarCaminoGrafo} from "./FuncionesGrafo";
    import {iniciarFlujoMaximo, avanzarFlujoMaximo, finalizarFlujoMaximo} from "./FuncionesFlujoMaximo";

    import {agregarTextoConsola} from "./FuncionesConsola";

    import Menu from "./Menu/Menu.svelte";
    import Consola from "./Consola/Consola.svelte";

    import Vertice from "./Vertice/Vertice.svelte";
    import Arista from "./Arista/Arista.svelte";

    import type MatrizAdyacencia from "../../interfaces/MatrizAdyacencia";
    import type  TypeVertice  from '../../interfaces/Vertice';
    import type TypeArista  from '../../interfaces/Arista';

    export let width: number ;
    export let height: number ;

    let bindSVG: SVGSVGElement;

    function getPosicionSVG() {
        //console.log({bindSVG});
        if(!bindSVG) return {x: 0, y: 0};

        const { x, y } = bindSVG.getBoundingClientRect();
        return { x, y };
    }

    let calculandoFlujoMaximo = false;
    let textoConsola = [];

    let matrizAdyacencia: MatrizAdyacencia = [];

    let vertices: TypeVertice[] = [];
    let fuentes: boolean[] = [];
    let sumideros: boolean[] = [];

    let aristas: TypeArista[][] = [];

    ({ matrizAdyacencia, fuentes, sumideros } = generarGrafoAlAzar(4));

    console.log(matrizAdyacencia);

    function recargarAristas() {
        aristas = aristas;
    }

    function recargarVertices() {
        vertices = vertices;
    }

    vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, recargarAristas, width, height);

    aristas = generarAristas(matrizAdyacencia, vertices);

    function dibujarCamino(camino: TypeVertice[], flujo: number) {
        dibujarCaminoGrafo(aristas, camino, flujo, recargarAristas);
    }

    function printConsola(texto: string) {
        agregarTextoConsola(texto, textoConsola);
        textoConsola = textoConsola;
    }

    async function calcularFlujoMaximo() {
        calculandoFlujoMaximo = true;
        await iniciarFlujoMaximo(vertices, aristas, matrizAdyacencia, dibujarCamino, printConsola);
        terminarFlujoMaximo();
    }

    function terminarFlujoMaximo() {
        finalizarFlujoMaximo(aristas, recargarAristas);
        calculandoFlujoMaximo = false;
    }


</script>

<div>
    <svg bind:this={bindSVG} width={width} height={height} class="select-none">

        <Consola
            texto={textoConsola}
        />

        <foreignObject width="100%" height="40px" >
            <Menu 
                calculandoFlujoMaximo={calculandoFlujoMaximo}

                calcularFlujoMaximo={calcularFlujoMaximo}
                avanzarFlujoMaximo={avanzarFlujoMaximo}
                terminarFlujoMaximo={terminarFlujoMaximo}
            />
        </foreignObject>
        
        <svg height={height}>

            {#each aristas as aristasDeVertice}
                {#each aristasDeVertice as arista}
                    {#if arista}
                        <Arista
                            arista={arista}
                        />
                    {/if}
                {/each}
            {/each}

            {#each vertices as vertice}
                <Vertice
                    bind:vertice={vertice} 
                />
            {/each}
        </svg>
    </svg>
</div>