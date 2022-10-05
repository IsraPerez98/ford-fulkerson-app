<script lang="ts">

    export let matrizAdyacencia: number[][];
    export let redResidual: number[][];

    $: dimension = redResidual.length;
    $: matrizColores = matrizAdyacencia.map((fila, i) => fila.map((_, j) => {
        if (matrizAdyacencia[i][j] !== redResidual[i][j]) {
            return "bg-rose-400";
        } else if (redResidual[i][j] <= 0) {
            return "bg-gray-200";
        } else {
            return "bg-emerald-400";
        }
    }));

</script>

<div class="overflow-auto text-white text-sm font-medium text-center p-4">
    <div style="grid-template-columns: repeat({dimension + 1}, minmax(0, 1fr));" class="grid gap-3">
        {#each Array(dimension + 1) as _, i}
            {#each Array(dimension + 1) as _, j}
                {#if i === 0 && j === 0}
                    <div class="p-2 rounded-lg shadow-lg bg-slate-800">
                        <p >
                            Índice
                        </p>
                    </div>
                {:else if i === 0}
                    <div class="p-2 rounded-lg shadow-lg bg-slate-800">
                        <p >
                            {j}
                        </p>
                    </div>
                {:else if j === 0}
                    <div class="p-2 rounded-lg shadow-lg bg-slate-800">
                        <p >
                            {i}
                        </p>
                    </div>
                {:else}
                    <div class="p-2 rounded-lg shadow-lg text-slate-800 {matrizColores[i-1][j-1]}">
                        <p>
                            {redResidual[i - 1][j - 1]}
                        </p>
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</div>