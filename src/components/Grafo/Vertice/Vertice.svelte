<script lang="ts">

    import type  Vertice  from '../../../classes/Vertice';

    export let vertice: Vertice;

    $: nombre = (vertice.nombre) ? vertice.nombre : `Vert. ${vertice.id}` ;
    $: grafo = vertice.grafo;
    
    $: creandoArista = grafo.creandoArista;
    $: eliminandoVertice = grafo.eliminandoVertice;

    let color = 'bg-purple-800';

    let moviendo = false;

    let mostrarMenu = false;

    $: {

        let colorNuevo = 'bg-purple-800';

        if(vertice.fuente) {
            colorNuevo = 'bg-green-700';
        }

        if(vertice.sumidero) {
            colorNuevo = 'bg-red-800';
        }

        if(eliminandoVertice) {
            colorNuevo = 'bg-gray-700';
        }

        if(creandoArista) {
            colorNuevo = 'bg-yellow-700';
        }

        if(colorNuevo != color) {
            color = colorNuevo;
        }
    }

    function onMouseDown() {
        if(eliminandoVertice) {
            vertice.eliminar();
            grafo.finalizarEliminacionVertice();
        }
        else if(creandoArista) {
            if(grafo.nuevaAristaVerticeOrigen == null) {
                grafo.seleccionarVerticeNuevaArista(vertice);
            }
            else {
                grafo.crearNuevaArista(grafo.nuevaAristaVerticeOrigen, vertice, 1); //TODO: PERMITIR QUE EL USUARIO INGRESE LA CAPACIDAD
            }
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
            /*
            const posX = vertice.posicion.x + e.movementX;
            const posY = vertice.posicion.y + e.movementY;
            */

            const posX = e.clientX;
            const posY = e.clientY;
            
            vertice.mover({x: posX, y: posY});
            vertice = vertice;
        }
    }

    function onTouchMove(e: TouchEvent) {
        if(moviendo) {
            const posX = e.touches[0].clientX;
            const posY = e.touches[0].clientY;
            
            vertice.mover({x: posX, y: posY});
            vertice = vertice;
        }
    }

    function onMouseEnter() {
        mostrarMenu = true;
    }

    function onMouseLeave(){
        mostrarMenu = false;
    }

    function toggleFuente() {
        if(vertice.sumidero) {
            alert('No se puede marcar un vértice como fuente y sumidero a la vez');
            return;
        }
        vertice.toggleFuente();
        vertice = vertice;
    }

    function toggleSumidero() {
        if(vertice.fuente) {
            alert('No se puede marcar un vértice como fuente y sumidero a la vez');
            return;
        }
        vertice.toggleSumidero();
        vertice = vertice;
    }

</script>

<foreignObject x={vertice.posicion.x - vertice.radio} y={vertice.posicion.y - vertice.radio} width={vertice.radio * 3} height={vertice.radio * 3} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
    <div class="flex h-full w-full">
        <div style="width: {vertice.radio*2}px ;height: {vertice.radio*2}px ;" class="cursor-pointer flex {color} rounded-full border border-white/20 overflow:hidden" on:mousedown={onMouseDown} on:touchstart={onMouseDown} >
            <p class="text-white text-center m-auto select-none">
                {nombre}
            </p>
        </div>
        <div style="width: {vertice.radio}px ;height: {vertice.radio}px ; {mostrarMenu? "display:block": "display:none"}" class="text-lg">
            <button on:click={() => { toggleFuente(); }} style="{vertice.fuente ? "" : "filter:grayscale(1);"}" title="Convertir en fuente" >
                🔼
            </button>
            <button on:click={() => { toggleSumidero(); }} style="{vertice.sumidero ? "" : "filter:grayscale(1);"}" title="Convertir en sumidero" >
                🔽
            </button>
        </div>
    </div>
</foreignObject>


<svelte:window on:mousemove={onMouseMove} on:touchmove={onTouchMove} on:touchend={onMouseUp} on:mouseup={onMouseUp} />