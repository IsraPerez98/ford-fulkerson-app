<script lang="ts">
    import { onMount } from "svelte";

    export let posicion: { x: number; y: number };
    export let angulo: number;

    export let fillColor: string;

    $: angulodeg = angulo * 180 / Math.PI;


</script>

<polygon
    class={`${fillColor}`}
    points="-15,25 0,0 15,25, 0,15"
    transform={`translate( ${posicion.x}, ${posicion.y} ) rotate(${angulodeg})`}
/>