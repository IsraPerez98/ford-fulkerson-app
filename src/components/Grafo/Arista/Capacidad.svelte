<script lang="ts">

    export let onClickArista: Function;
    
    export let posicion: { x: number; y: number };
    
    export let capacidad: number | string;

    $: if(capacidad === Infinity) {
        capacidad = "∞";
    }
    
    export let bgColor: string;
    
    export let cambiarCapacidad: Function | null = null;

    export let textColor: string = "text-white";

    export let dibujarCero: boolean = true;
    
    export let radio: number;
    
    function cambioCapacidad() {
        const capacidadActual = capacidad;
        
        const capacidadNueva = parseInt(this.value);
        
        //si la capacidad nueva no es un numero valido no se cambia
        if(isNaN(capacidadNueva) || capacidadNueva < 0 ) {
            console.log("Nueva capacidad no es un numero valido");
            alert("Nueva capacidad no es un numero valido");
            this.value = capacidadActual;
            return;
        }

        if( capacidadNueva > 999 ) {
            console.log("La capacidad no puede ser mayor a 1000");
            alert("La capacidad no puede ser mayor a 1000");
            this.value = capacidadActual;
            return;
        }
        
        
        this.value = cambiarCapacidad(capacidadNueva);
    }

    function onClick() {
        onClickArista();
    }
    
    
</script>

{#if (capacidad == "∞" || (!isNaN(Number(capacidad)) && capacidad > 0 )) && (dibujarCero || Number(capacidad) !== 0 ) }
    <foreignObject on:click={onClick} x={posicion.x - radio} y={posicion.y - radio} width={radio * 2} height={radio * 2}>
        <div class="flex w-full h-full {textColor} text-center {bgColor} rounded-full border border-white/20 text-xs sm:text-sm md:text-base">
            
            {#if cambiarCapacidad}
                <input type="text" class="w-full h-full text-center bg-transparent appearance-none border-none outline-none " value={capacidad} on:change={cambioCapacidad} />
            {:else}
                <div class="m-auto text-center ">{capacidad}</div>
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