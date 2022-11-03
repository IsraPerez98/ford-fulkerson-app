<script lang="ts">

    import type Grafo from '../../../classes/Grafo';
    import type MatrizAdyacencia from '../../../interfaces/MatrizAdyacencia';
    import type Posicion from '../../../interfaces/Posicion';

    export let grafo: Grafo;

    $: estaEjecutandoFlujoMaximo = grafo.ejecutandoFlujoMaximo;
    $: estaModificandoGrafo = grafo.creandoArista || grafo.creandoVertice || grafo.eliminandoArista || grafo.eliminandoVertice;

    $: puedeIniciarFlujoMaximo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo;
    $: puedeContinuarFlujoMaximo = estaEjecutandoFlujoMaximo;
    $: puedeDetenerFlujoMaximo = estaEjecutandoFlujoMaximo;
    $: puedeModificarGrafo = !estaEjecutandoFlujoMaximo && !estaModificandoGrafo;

    function onClickAyuda() {
        console.log("Ayuda");
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
            alert("Ingrese un número válido");
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
                const posicionesVertices: Posicion[] = json.posicionesVertices;
                const fuentes: boolean[] = json.fuentes;
                const sumideros: boolean[] = json.sumideros;

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

</script>

<div class="w-full h-10 bg-gray-900 flex">
    <div class="flex my-auto ml-2 text-2xl text-center space-x-10 px-2">
        <button title="Ayuda" class="bg-indigo-600 w-8 h-8 rounded-lg " on:click={onClickAyuda}>
            ?
        </button>
        <div class="flex my-auto text-2xl space-x-4">
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
        <div class="flex my-auto text-2xl space-x-4">
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
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Agregar Vertice" on:click={onClickCrearNuevoVertice} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔵
                <div class="absolute bottom-1 ml-3 text-base" >
                    ✨
                </div>
            </button>
            <button title="Agregar Arista" on:click={onClickCrearNuevaArista} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔗
                <div class="absolute bottom-1 ml-3 text-base" >
                    ✨
                </div>
            </button>
        </div>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Eliminar Vertice" on:click={onClickEliminarVertice} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔵
                <div class="absolute bottom-1 ml-3 text-base" >
                    ❌
                </div>
            </button>
            <button title="Eliminar Arista" on:click={onClickEliminarArista} disabled={!puedeModificarGrafo} class="disabled:grayscale">
                🔗
                <div class="absolute bottom-1 ml-3 text-base" >
                    ❌
                </div>
            </button>
        </div>
    </div>
</div>