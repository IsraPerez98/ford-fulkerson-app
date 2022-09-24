<script lang="ts">
    export let calculandoFlujoMaximo: boolean;

    export let calcularFlujoMaximo: Function;
    export let avanzarFlujoMaximo: Function;
    export let terminarFlujoMaximo: Function;

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
        terminarFlujoMaximo();
    }


</script>

<div class="w-full h-10 bg-gray-900 flex">
    <div class="flex my-auto ml-2 text-2xl">
        <button title="Ayuda" on:click={onClickAyuda}>
            ℹ️
        </button>
        <div class="flex my-auto mx-8 text-2xl space-x-4">
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

    </div>
</div>