<script lang="ts">

    export let matrizAdyacencia: number[][];
    export let redResidual: number[][];

    $: dimension = redResidual.length;
    $: matrizColores = matrizAdyacencia.map((fila, i) => fila.map((_, j) => {
        if (matrizAdyacencia[i][j] !== redResidual[i][j]) {
            if(redResidual[i][j] === 0) {
                return "bg-rose-700";
            }
            return "bg-rose-400";
        } else if (redResidual[i][j] <= 0) {
            return "bg-gray-200";
        } else {
            return "bg-emerald-400";
        }
    }));

</script>

<div class="overflow-auto text-white text-sm font-medium text-center p-2">
    <div style="grid-template-columns: repeat({dimension + 1}, minmax(max-content, auto));" class="items-center grid auto-rows-max auto-cols-max gap-3">
        {#each Array(dimension + 1) as _, i}
            {#each Array(dimension + 1) as _, j}
                {#if i === 0 && j === 0}
                    <div class="py-2 rounded-lg shadow-lg bg-slate-800 w-14">
                        <p >
                            Índice
                        </p>
                    </div>
                {:else if i === 0}
                    <div class="py-2 rounded-lg shadow-lg bg-slate-800 w-14">
                        <p >
                            {j-1}
                        </p>
                    </div>
                {:else if j === 0}
                    <div class="py-2 rounded-lg shadow-lg bg-slate-800 w-14 ">
                        <p >
                            {i-1}
                        </p>
                    </div>
                {:else}
                    <div class="py-2 rounded-lg shadow-lg text-slate-800 w-14 {matrizColores[i-1][j-1]}">
                        <p>
                            {redResidual[i - 1][j - 1]}
                        </p>
                    </div>
                {/if}
            {/each}
        {/each}
    </div>
</div>