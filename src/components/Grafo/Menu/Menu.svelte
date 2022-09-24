<script lang="ts">
    export let calculandoFlujoMaximo: boolean;

    export let calcularFlujoMaximo: Function;
    export let avanzarFlujoMaximo: Function;
    export let finalizarFlujoMaximo: Function;
    export let guardarGrafo: Function;
    export let cargarGrafo: Function;
    
    export let generarGrafoAlAzar: Function;

    function onClickAyuda() {
        console.log("Ayuda");
    }

    function onClickIniciarFlujo() {
        if(calculandoFlujoMaximo) return;
        calcularFlujoMaximo();
    }

    function onClickAvanzarFlujo() {
        if(!(calculandoFlujoMaximo)) return;
        avanzarFlujoMaximo();
    }

    function onClickDetenerFlujo() {
        if(!(calculandoFlujoMaximo)) return;
        finalizarFlujoMaximo();
    }

    function onClickGenerarGrafoAleatorio() {
        if(calculandoFlujoMaximo) return;

        const numeroVertices = prompt("Ingrese el número de vértices del grafo");
        if(numeroVertices === null || numeroVertices === ""  || isNaN(Number(numeroVertices)) || Number(numeroVertices) < 1) {
            alert("Ingrese un número válido");
            return;
        }

        const confirmar = confirm("Esto eliminará el grafo actual, ¿desea continuar?");
        if(!confirmar) return;

        const numeroVerticesInt = Number(numeroVertices);
        
        generarGrafoAlAzar(numeroVerticesInt);
    }

    function onClickGuardarGrafo() {
        if(calculandoFlujoMaximo) return;

        guardarGrafo();
    }

    function onClickCargarGrafo() {
        if(calculandoFlujoMaximo) return;

        cargarGrafo();
    }

</script>

<div class="w-full h-10 bg-gray-900 flex">
    <div class="flex my-auto ml-2 text-2xl space-x-10 px-2">
        <button title="Ayuda" on:click={onClickAyuda}>
            ℹ️
        </button>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Iniciar Algoritmo de Flujo Maximo" on:click={onClickIniciarFlujo} disabled={calculandoFlujoMaximo} class="disabled:grayscale" >
                ▶️
            </button>
            <button title="Avanzar Algoritmo de Flujo Maximo" on:click={onClickAvanzarFlujo} disabled={!calculandoFlujoMaximo} class="disabled:grayscale">
                ⏯️
            </button>
            <button title="Detener Algoritmo de Flujo Maximo" on:click={onClickDetenerFlujo} disabled={!calculandoFlujoMaximo} class="disabled:grayscale">
                ⏹️
            </button>
        </div>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Generar Grafo Aleatorio" on:click={onClickGenerarGrafoAleatorio } disabled={calculandoFlujoMaximo} class="disabled:grayscale">
                🎲
            </button>
            <button title="Guardar Grafo" on:click={onClickGuardarGrafo} disabled={calculandoFlujoMaximo} class="disabled:grayscale">
                💾
            </button>
            <button title="Cargar Grafo" on:click={onClickCargarGrafo} disabled={calculandoFlujoMaximo} class="disabled:grayscale">
                📁
            </button>
        </div>
        <div class="flex my-auto text-2xl space-x-4">
            <button title="Agregar Vertice" disabled={calculandoFlujoMaximo} class="disabled:grayscale">
                🔵
                <div class="absolute bottom-1 ml-3 text-base" >
                    ➕
                </div>
            </button>
            <button title="Agregar Arista" disabled={calculandoFlujoMaximo} class="disabled:grayscale">
                🪡
                <div class="absolute bottom-1 ml-3 text-base" >
                    ➕
                </div>
            </button>
        </div>
    </div>
</div>