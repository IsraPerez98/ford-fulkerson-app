<script lang="ts">

    export let posicion: { x: number; y: number };
    export let angulo: number;

    export let fillColor: string;
    export let onClickArista: Function;

    $: angulodeg = angulo * 180 / Math.PI;

    function onClick() {
        onClickArista();
    }

    let multiplicadorTamanio = 1;

    function reajustarTamanio(): void {
        let nuevoMultiplicadorTamanio = 1;

        if(window.innerWidth < 768) { //md
            nuevoMultiplicadorTamanio = 0.5;
        }

        else if(window.innerWidth < 1024) { //lg
            nuevoMultiplicadorTamanio = 0.75;
        }

        multiplicadorTamanio = nuevoMultiplicadorTamanio;
    }

    reajustarTamanio();

    window.addEventListener('resize', reajustarTamanio);

</script>

<polygon
    on:click={onClick}
    class={`${fillColor}`}
    points="-{15*multiplicadorTamanio},{25*multiplicadorTamanio} 0,0 {15*multiplicadorTamanio},{25*multiplicadorTamanio}, 0,{15*multiplicadorTamanio}"
    transform={`translate( ${posicion.x}, ${posicion.y} ) rotate(${angulodeg})`}
/>