<script lang="ts">
    import { getContext } from 'svelte';
    import { toast } from 'svelte-cool-toast';
    import { twemoji } from 'twemoji-svelte-action';

    import Ayuda from '../Ayuda/Ayuda.svelte';

    import type Grafo from '../../classes/Grafo';
    import type MatrizAdyacencia from '../../interfaces/MatrizAdyacencia';
    import type Posicion from '../../interfaces/Posicion';

    import ModeSwitcher from './ModeSwitcher.svelte';

    const githubLogo = "./img/GitHub-Mark-64px.png"
    const repoURL = "https://github.com/IsraPerez98/app-titulo";

    //@ts-ignore
    const { open } = getContext('simple-modal');

    export let grafo: Grafo;

    $: estaEjecutandoFlujoMaximo = grafo.ejecutandoFlujoMaximo;
    $: estaModificandoGrafo = grafo.creandoArista || grafo.creandoVertice || grafo.eliminandoArista || grafo.eliminandoVertice;

    $: puedeIniciarFlujoMaximo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo;
    $: puedeContinuarFlujoMaximo = estaEjecutandoFlujoMaximo;
    $: puedeDetenerFlujoMaximo = estaEjecutandoFlujoMaximo;
    $: puedeModificarGrafo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo;

    function onClickAyuda() {
        open(Ayuda);
    }

    function onClickIniciarFlujo() {
        if(!puedeIniciarFlujoMaximo) return;
        grafo.inciarFlujoMaximo();
    }

    function onClickAvanzarFlujo() {
        if(!puedeContinuarFlujoMaximo) return;
        grafo.continuarFlujoMaximo();
    }

    function onClickDetenerFlujo() {
        if(!puedeDetenerFlujoMaximo) return;
        grafo.finalizarFlujoMaximo();
    }

    function onClickGenerarGrafoAleatorio() {
        if(!puedeModificarGrafo) return;

        const numeroVertices = prompt("Ingrese el número de vértices del grafo");
        if(numeroVertices === null || numeroVertices === ""  || isNaN(Number(numeroVertices)) || Number(numeroVertices) < 1) {
            console.log("Numero invalido de vertices");
            //alert("Ingrese un número válido");
            toast("Número invalido de vertices", {
                title: "Error",
                type: "error",
                duration: 5000,
            });
            return;
        }

        if(Number(numeroVertices) > 15) {
            console.error("El número de vértices no puede ser mayor a 15");
            //alert("El número de vértices no puede ser mayor a 15");
            toast( "El número de vértices no puede ser mayor a 15", {
                title: "Error",
                type: "error",
                duration: 5000,
            });
            return;
        }

        const confirmar = confirm("Esto eliminará el grafo actual, ¿desea continuar?");
        if(!confirmar) return;

        const numeroVerticesInt = Number(numeroVertices);
        
        grafo.generarGrafoAlAzar(numeroVerticesInt);
    }

    function onClickGuardarGrafo() {
        grafo.guardarGrafo();
    }

    function onClickCargarGrafo() {
        if(!puedeModificarGrafo) return;
        //leemos un archivo json
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = JSON.parse(reader.result as string);
                const matrizAdyacencia: MatrizAdyacencia = json.matrizAdyacencia;
                //revisamos los valores -1 en la matriz de adyacencia que corresponden a Infinity
                for(let i = 0; i < matrizAdyacencia.length; i++) {
                    for(let j = 0; j < matrizAdyacencia[i].length; j++) {
                        if(matrizAdyacencia[i][j] === -1) {
                            matrizAdyacencia[i][j] = Infinity;
                        }
                    }
                }
                const posicionesRelativasVertices: Posicion[] = json.posicionesVertices;
                const fuentes: boolean[] = json.fuentes;
                const sumideros: boolean[] = json.sumideros;

                const posicionesVertices: Posicion[] = [];

                for(let i = 0; i < posicionesRelativasVertices.length; i++) {
                    const posicionRelativa = posicionesRelativasVertices[i];
                    const posicion = {
                        x: posicionRelativa.x * grafo.width,
                        y: posicionRelativa.y * grafo.height
                    }
                    posicionesVertices.push(posicion);
                }

                grafo.generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros);
                grafo.recargarGrafo();
            }
            reader.readAsText(file);
        }
        input.click();
    }

    function onClickCrearNuevoVertice() {
        if(!puedeModificarGrafo) return;
        grafo.iniciarCreacionVertice();
    }

    function onClickCrearNuevaArista() {
        if(!puedeModificarGrafo) return;
        grafo.iniciarCreacionArista();
    }

    function onClickEliminarVertice() {
        if(!puedeModificarGrafo) return;
        grafo.iniciarEliminacionVertice();
    }

    function onClickEliminarArista() {
        if(!puedeModificarGrafo) return;
        grafo.iniciarEliminacionArista();
    }
    
    function onClickAbrirGithub() {
        window.open(repoURL, "_blank");
    }

</script>

<div class="h-screen w-10 md:w-screen md:h-10 flex flex-col md:flex-row bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-2xl border-r md:border-b border-slate-700/20 ">
    <div use:twemoji={{className: 'emoji-menu'}} class="h-full md:w-full flex flex-col md:flex-row mx-auto text-2xl text-center space-y-4 last:space-y-none md:space-y-0 md:space-x-10 md:mx-8 my-8 md:my-auto text-white items-center overflow-auto">
        <button title="Ayuda" class="bg-indigo-600 w-8 h-8 rounded-lg " on:click={onClickAyuda}>
            ?
        </button>
        <div class="flex flex-col md:flex-row my-auto text-2xl space-y-2 md:space-y-0 md:space-x-4">
            <button title="Iniciar Algoritmo de Flujo Maximo" on:click={onClickIniciarFlujo} disabled={!puedeIniciarFlujoMaximo} class="disabled:grayscale" >
                ▶️
            </button>
            <button title="Avanzar Algoritmo de Flujo Maximo" on:click={onClickAvanzarFlujo} disabled={!puedeContinuarFlujoMaximo} class="disabled:grayscale">
                ⏯️
            </button>
            <button title="Detener Algoritmo de Flujo Maximo" on:click={onClickDetenerFlujo} disabled={!puedeDetenerFlujoMaximo} class="disabled:grayscale">
                ⏹️
            </button>
        </div>
        <div class="flex flex-col md:flex-row my-auto text-2xl space-y-2 md:space-y-0 md:space-x-4">
            <button title="Generar Grafo Aleatorio" on:click={onClickGenerarGrafoAleatorio } disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🎲
            </button>
            <button title="Guardar Grafo" on:click={onClickGuardarGrafo} class="disabled:grayscale">
                💾
            </button>
            <button title="Cargar Grafo" on:click={onClickCargarGrafo} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                📁
            </button>
        </div>
        <div class="flex flex-col md:flex-row text-2xl space-y-2 md:space-y-0 md:space-x-4 my-auto md:h-full overflow-hidden md:py-1">
            <button title="Agregar Vertice" on:click={onClickCrearNuevoVertice} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔵
                <div class="relative bottom-4 ml-3 text-base" >
                    ✨
                </div>
            </button>
            <button title="Agregar Arista" on:click={onClickCrearNuevaArista} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔗
                <div class="relative bottom-4 ml-3 text-base" >
                    ✨
                </div>
            </button>
        </div>
        <div class="flex flex-col md:flex-row my-auto text-2xl space-y-2 md:space-y-0 md:space-x-4 md:h-full overflow-hidden md:py-1">
            <button title="Eliminar Vertice" on:click={onClickEliminarVertice} disabled={!puedeModificarGrafo} class="disabled:grayscale ">
                🔵
                <div class="relative bottom-4 ml-3 text-base" >
                    ❌
                </div>
            </button>
            <button title="Eliminar Arista" on:click={onClickEliminarArista} disabled={!puedeModificarGrafo} class="disabled:grayscale ">
                🔗
                <div class="relative bottom-4 ml-3 text-base" >
                    ❌
                </div>
            </button>
        </div>
    </div>
    <div class="mt-auto md:ml-auto mb-6 md:mb-auto md:mr-6 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        <button 
                on:click={onClickAbrirGithub} 
                title={'Repositorio de GitHub'}
                
                class="w-6 h-6"
            >
                <img alt="GitHub" src={githubLogo} 
                class="w-6 h-6 invert-0 dark:invert" 
            />
        </button>
        <div>
            <ModeSwitcher />
        </div>
    </div>
</div>

<style global>
    img.emoji-menu {
        height: 1.25em;
        width: 1.25em;
    }
</style>