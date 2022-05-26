<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import Grafo from './grafo.svelte';

    let bindcanvas;

    let svggrafo;

    onMount(() => {
        draw();
    });

    function draw() {
        const canvas = d3.select(bindcanvas);

        canvas.html(null); //borrar todo

        canvas.append('svg')
            .attr('width', 800)
            .attr('height', 800)
        
        svggrafo = canvas.select('svg');
    }
</script>

<main>
    <div bind:this={bindcanvas}>
        <Grafo svggrafo={svggrafo} />
    </div>
</main>