<script lang="ts">
    import type Vertice from "../../../interfaces/Vertice";

    export let posicion: { x: number; y: number };
    
    export let verticeDesde: Vertice;
    export let verticeHasta: Vertice;
    export let peso: number;

    export let bgColor: string;

    export let cambiarPeso: Function;

    const radiopeso = 20;

    function cambioPeso() {
        const pesoActual = peso;

        const pesoNuevo = parseInt(this.value);
        
        //si el peso nuevo no es un numero no se cambia
        if(isNaN(pesoNuevo)) {
            console.log("Nuevo peso no es un numero valido");
            this.value = pesoActual;
            return;
        }

        const desdeID = verticeDesde.id;
        const hastaID = verticeHasta.id;

        cambiarPeso(desdeID, hastaID, pesoNuevo);
    }


</script>


<foreignObject x={posicion.x - radiopeso} y={posicion.y - radiopeso} width={radiopeso * 2} height={radiopeso * 2}>
    <div class="flex w-full h-full {bgColor} rounded-full border border-white/20">
        <input class="w-full h-full text-white text-center m-auto bg-transparent border-none outline-none" type="text" value={peso} on:change={cambioPeso} />
    </div>
</foreignObject>
