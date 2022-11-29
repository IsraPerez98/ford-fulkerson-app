<script lang="ts">
    import AristaComponent from './Arista/Arista.svelte';
    import VerticeComponent from './Vertice/Vertice.svelte';

    import type Arista from '../../classes/Arista';
    import type Vertice from '../../classes/Vertice';

    export let aristas: Arista[][];
    export let vertices: Vertice[];

    export let width: number | string = "100%";
    export let height: number | string = "100%";

    export let x: number | string = 0;
    export let y: number | string = 0;

</script>

<svg x={x} y={y} width={width} height={height} >
    {#each Array(aristas.length) as _, i}
        {#each Array(i+1) as _, j}
            {#if aristas[i][j] || aristas[j][i]}
                <AristaComponent 
                    arista={aristas[i][j]}
                    aristaInversa={aristas[j][i]}
                />
            {/if}
        {/each}
    {/each}
    
    {#each vertices as vertice}
        <VerticeComponent {vertice} />
    {/each}
</svg>