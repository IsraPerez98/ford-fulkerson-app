<script lang="ts">
    
    export let posicion: { x: number; y: number };
    
    export let peso: number | string;

    if(peso === Infinity) {
        peso = "∞";
    }
    
    export let bgColor: string;
    
    export let cambiarPeso: Function | null = null;

    export let textColor: string = "text-white";
    
    const radiopeso = 20;
    
    function cambioPeso() {
        const pesoActual = peso;
        
        const pesoNuevo = parseInt(this.value);
        
        //si el peso nuevo no es un numero no se cambia
        if(isNaN(pesoNuevo) || pesoNuevo < 0) {
            console.log("Nuevo peso no es un numero valido");
            alert("Nuevo peso no es un numero valido");
            this.value = pesoActual;
            return;
        }
        
        
        cambiarPeso(pesoNuevo);
    }
    
    
</script>

{#if (peso == "∞" || !isNaN(Number(peso))) && Number(peso) !== 0}
    <foreignObject x={posicion.x - radiopeso} y={posicion.y - radiopeso} width={radiopeso * 2} height={radiopeso * 2}>
        <div class="flex w-full h-full {textColor} text-center {bgColor} rounded-full border border-white/20">
            
            {#if cambiarPeso}
                <input type="text" class="w-full h-full text-center bg-transparent appearance-none border-none outline-none " value={peso} on:change={cambioPeso} />
            {:else}
                <div class="m-auto text-center ">{peso}</div>
            {/if}
            
        </div>
    </foreignObject>
{/if}


<style>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    /* Firefox */
    input {
        -moz-appearance: textfield;
    }

</style>