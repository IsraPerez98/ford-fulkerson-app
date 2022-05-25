<script lang="ts">
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    let bindcanvas;

    onMount(() => {
        
        const canvas = d3.select(bindcanvas);

        canvas.append('svg')
            .attr('width', 500)
            .attr('height', 500)
        

        const svg = canvas.select('svg');

        svg.append('circle')
            .attr('cx', 250)
            .attr('cy', 250)
            .attr('r', 100)
            .attr('fill', 'red');

    });

</script>

<main>
    <p1>HI</p1>
    <div bind:this={bindcanvas}>

    </div>
</main>