<script lang="ts">

    export let posicion: { x: number; y: number };
    export let angulo: number;

    export let fillColor: string;
    export let onClickArista: Function;

    $: angulodeg = angulo * 180 / Math.PI;

    function onClick() {
        onClickArista();
    }

</script>

<polygon
    on:click={onClick}
    class={`${fillColor}`}
    points="-15,25 0,0 15,25, 0,15"
    transform={`translate( ${posicion.x}, ${posicion.y} ) rotate(${angulodeg})`}
/>