<script lang="ts">

    import type Grafo from '../../../classes/Grafo';
    import MatrizAdyacencia from '../../../classes/MatrizAdyacencia';

    export let grafo: Grafo;

    function onClickAyuda() {
        console.log("Ayuda");
    }

    function onClickIniciarFlujo() {
        //if(!grafo.puedeIniciarFlujoMaximo()) return;
        grafo.inciarFlujoMaximo();
    }

    function onClickAvanzarFlujo() {
        //if(!grafo.puedeAvanzarFlujoMaximo()) return;
        grafo.continuarFlujoMaximo();
    }

    function onClickDetenerFlujo() {
        //if(!grafo.puedeDetenerFlujoMaximo()) return;
        grafo.finalizarFlujoMaximo();
    }

    function onClickGenerarGrafoAleatorio() {
        //if(!grafo.esModificable()) return;

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
        //if(!grafo.esModificable()) return;
        //leemos un archivo json
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const json = JSON.parse(reader.result as string);
                const matrizAdyacencia = new MatrizAdyacencia(json.matrizAdyacencia);
                const posicionesVertices = json.posicionesVertices;
                const fuentes = json.fuentes;
                const sumideros = json.sumideros;

                grafo.generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros);
            }
            reader.readAsText(file);
        }
        input.click();
    }

    function onClickCrearNuevoVertice() {
        
    }

</script>

<div class="w-full h-10 bg-gray-900 flex">
    <div class="flex my-auto ml-2 text-2xl space-x-10 px-2">
        <button title="Ayuda" on:click={onClickAyuda}>
            ℹ️
        </button>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Iniciar Algoritmo de Flujo Maximo" on:click={onClickIniciarFlujo}  class="disabled:grayscale" >
                ▶️
            </button>
            <button title="Avanzar Algoritmo de Flujo Maximo" on:click={onClickAvanzarFlujo}  class="disabled:grayscale">
                ⏯️
            </button>
            <button title="Detener Algoritmo de Flujo Maximo" on:click={onClickDetenerFlujo}  class="disabled:grayscale">
                ⏹️
            </button>
        </div>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Generar Grafo Aleatorio" on:click={onClickGenerarGrafoAleatorio }  class="disabled:grayscale">
                🎲
            </button>
            <button title="Guardar Grafo" on:click={onClickGuardarGrafo} class="disabled:grayscale">
                💾
            </button>
            <button title="Cargar Grafo" on:click={onClickCargarGrafo}  class="disabled:grayscale">
                📁
            </button>
        </div>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Agregar Vertice" on:click={onClickCrearNuevoVertice}  class="disabled:grayscale">
                🔵
                <div class="absolute bottom-1 ml-3 text-base" >
                    ➕
                </div>
            </button>
            <button title="Agregar Arista"  class="disabled:grayscale">
                🪡
                <div class="absolute bottom-1 ml-3 text-base" >
                    ➕
                </div>
            </button>
        </div>
    </div>
</div>