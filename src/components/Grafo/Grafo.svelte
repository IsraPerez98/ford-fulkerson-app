<script lang="ts">
    import {generarVertices, generarAristas, generarGrafoAlAzar, dibujarCamino as dibujarCaminoGrafo} from "./FuncionesGrafo";
    import {iniciarFlujoMaximo, avanzarFlujoMaximo, finalizarFlujoMaximo} from "./FuncionesFlujoMaximo";
    import {guardarGrafo as guardarGrafoAux, cargarGrafo as cargarGrafoAux} from "./FuncionesGuardado";

    import {agregarTextoConsola} from "./FuncionesConsola";

    import Menu from "./Menu/Menu.svelte";
    import Consola from "./Consola/Consola.svelte";

    import Vertice from "./Vertice/Vertice.svelte";
    import Arista from "./Arista/Arista.svelte";

    import type Posicion from "../../interfaces/Posicion";
    import type MatrizAdyacencia from "../../interfaces/MatrizAdyacencia";
    import type  TypeVertice from '../../interfaces/Vertice';
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

    function recargarAristas() {
        aristas = aristas;
    }

    function recargarVertices() {
        vertices = vertices;
    }

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

    function generarNuevoGrafoAlAzar(numeroVertices: number) {
        let posiciones: Posicion[];
        ({ matrizAdyacencia, fuentes, sumideros, posiciones } = generarGrafoAlAzar(numeroVertices, width, height));
        
        vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, posiciones, recargarAristas, width, height);
        aristas = generarAristas(matrizAdyacencia, vertices);

        console.log({matrizAdyacencia});
    }

    generarNuevoGrafoAlAzar(5);

    function guardarGrafo() {
        guardarGrafoAux(matrizAdyacencia, vertices, fuentes, sumideros);
    }

    async function cargarGrafo() {
        ({matrizAdyacencia, fuentes, sumideros, vertices , aristas} = await cargarGrafoAux(width, height, recargarAristas));
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
                finalizarFlujoMaximo={terminarFlujoMaximo}
                
                generarGrafoAlAzar={generarNuevoGrafoAlAzar}
                guardarGrafo={guardarGrafo}
                cargarGrafo={cargarGrafo}
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