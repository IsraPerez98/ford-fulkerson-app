<script lang="ts">
    
    import type  Vertice  from '../../../interfaces/Vertice';

    export let vertice: Vertice;

    export let moverVertice: Function;
    
    export let creandoArista: boolean;
    export let seleccionarVerticeDeNuevaArista: Function;

    export let eliminandoVertice: boolean;
    export let eliminarVertice: Function;

    export let toggleSumidero: Function;
    export let toggleFuente: Function;

    $: nombre = (vertice.nombre) ? vertice.nombre : `Vert. ${vertice.id}` ;

    const radio = 35;
    let color = 'bg-violet-700';

    let moviendo = false;

    let seleccionadoNuevaArista = false;

    let mostrarMenu = false;

    $: {

        let colorNuevo = 'bg-purple-800';

        if(vertice.fuente) {
            colorNuevo = 'bg-green-700';
        }

        if(vertice.sumidero) {
            colorNuevo = 'bg-red-800';
        }
        
        if(!(creandoArista)) {
            seleccionadoNuevaArista = false;
        }

        if(eliminandoVertice) {
            colorNuevo = 'bg-red-700';
        }

        if(creandoArista) {
            colorNuevo = 'bg-green-900';
        }

        if(seleccionadoNuevaArista) {
            colorNuevo = 'bg-yellow-700';
        }

        if(colorNuevo != color) {
            color = colorNuevo;
        }
    }

    function onMouseDown() {
        if(eliminandoVertice) {
            eliminarVertice(vertice.id);
        }
        else if(creandoArista) {
            seleccionarVerticeDeNuevaArista(vertice.id);
        }
        else {
            moviendo = true;
        }
    }

    function onMouseUp() {
        moviendo = false;
    }

    function onMouseMove(e) {
        if(moviendo) {
            const posX = vertice.x + e.movementX;
            const posY = vertice.y + e.movementY;
            
            moverVertice(vertice, posX, posY);
        }
    }

    function onMouseEnter() {
        mostrarMenu = true;
    }

    function onMouseLeave(){
        mostrarMenu = false;
    }

</script>

<foreignObject x={vertice.x - radio} y={vertice.y - radio} width={radio * 3} height={radio * 3} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
    <div class="flex h-full w-full">
        <div style="width: {radio*2}px ;height: {radio*2}px ;" class="cursor-pointer flex {color} rounded-full border border-white/20 overflow:hidden" on:mousedown={onMouseDown}>
            <p class="text-white text-center m-auto select-none">
                {nombre}
            </p>
        </div>
        <div style="width: {radio}px ;height: {radio}px ; {mostrarMenu? "display:block": "display:none"}" class="text-lg">
            <button on:click={() => { toggleFuente(vertice.id) }} style="{vertice.fuente ? "" : "filter:grayscale(1);"}" title="Convertir en fuente" >
                🔼
            </button>
            <button on:click={() => { toggleSumidero(vertice.id) }} style="{vertice.sumidero ? "" : "filter:grayscale(1);"}" title="Convertir en sumidero" >
                🔽
            </button>
        </div>
    </div>
</foreignObject>


<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>