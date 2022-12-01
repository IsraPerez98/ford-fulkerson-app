<script lang="ts">

    import { twemoji } from 'twemoji-svelte-action';

    import type  Vertice  from '../../../classes/Vertice';

    export let vertice: Vertice;

    $: nombre = (vertice.nombre) ? vertice.nombre : `Vert. ${vertice.id}` ;
    $: grafo = vertice.grafo;
    
    $: creandoArista = grafo.creandoArista;
    $: eliminandoVertice = grafo.eliminandoVertice;

    $: puedeCambiarSumideroyFuente =  !grafo.ejecutandoFlujoMaximo;

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
            return;
        }

        if(creandoArista) {
            
            if(grafo.nuevaAristaVerticeOrigen == null) {
                grafo.seleccionarVerticeNuevaArista(vertice);
                return;
            }
            
            if(grafo.nuevaAristaVerticeOrigen === vertice) {
                alert('No puedes crear una arista que conecte un vértice consigo mismo');
                return;
            }

            grafo.crearNuevaArista(grafo.nuevaAristaVerticeOrigen, vertice, 1); //TODO: PERMITIR QUE EL USUARIO INGRESE LA CAPACIDAD
            return;
        }
        
        moviendo = true;
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

            const posX = e.clientX - vertice.grafo.posicion.x;
            const posY = e.clientY - vertice.grafo.posicion.y;
            
            vertice.mover({x: posX, y: posY});
            vertice = vertice;
        }
    }

    function onTouchMove(e: TouchEvent) {
        if(moviendo) {
            const posX = e.touches[0].clientX - vertice.grafo.posicion.x;
            const posY = e.touches[0].clientY - vertice.grafo.posicion.y;
            
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

<foreignObject x={vertice.posicion.x - vertice.radio} y={vertice.posicion.y - vertice.radio} width={vertice.radio * 4} height={vertice.radio * 2} on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
    <div class="h-full w-full flex flex-row">
        <div style="width: {vertice.radio*2}px ;height: {vertice.radio*2}px ;" class="flex cursor-pointer {color} rounded-full border border-white/20 overflow:hidden" on:pointerdown={onMouseDown} >
            <p class="text-white text-center m-auto text-xs sm:text-sm md:text-base select-none">
                {nombre}
            </p>
        </div>
        {#if puedeCambiarSumideroyFuente}

            <div class="w-4 lg:w-6 h-full flex-col space-y-1 ml-1 justify-center {mostrarMenu? 'flex': 'hidden'}">
                {#if vertice.fuente}
                    <button use:twemoji on:click={() => { toggleFuente(); }} title="Desmarcar como fuente" >
                        🔽
                    </button>
                {:else if vertice.sumidero}
                    <button use:twemoji on:click={() => { toggleSumidero(); }} title="Desmarcar como sumidero" >
                        🔼
                    </button>
                {:else}
                    <button use:twemoji on:click={() => { toggleFuente(); }} title="Convertir en fuente" >
                        🔼
                    </button>
                    
                    <button use:twemoji on:click={() => { toggleSumidero(); }} title="Convertir en sumidero" >
                        🔽
                    </button>
                {/if}
                
            </div>
        {/if}
    </div>
</foreignObject>


<svelte:window on:mousemove={onMouseMove} on:touchmove={onTouchMove} on:touchend={onMouseUp} on:mouseup={onMouseUp} />