<script lang="ts">
    
    import type  Vertice  from '../../../interfaces/Vertice';

    export let vertice: Vertice;

    export let reposicionarAristas: Function;
    
    export let creandoArista: boolean;
    export let seleccionarVerticeDeNuevaArista: Function;

    export let eliminandoVertice: boolean;
    export let eliminarVertice: Function;

    $: nombre = (vertice.nombre) ? vertice.nombre : `Vert. ${vertice.id}` ;

    const radio = 35;
    let color = 'bg-violet-700';

    let moviendo = false;

    let seleccionadoNuevaArista = false;

    $: {

        let colorNuevo = 'bg-purple-800';

        if(vertice.fuente) {
            colorNuevo = 'bg-purple-800';
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
            vertice.x += e.movementX;
            vertice.y += e.movementY;
            
            reposicionarAristas(vertice.id);
        }
    }
</script>

<svg x={vertice.x - radio} y={vertice.y - radio} width={radio * 2} height={radio * 2} on:mousedown={onMouseDown}>
    <foreignObject width={radio * 2} height={radio * 2}>
        <div class="cursor-pointer flex w-full h-full {color} rounded-full border border-white/20 overflow:hidden">
            <p class="text-white text-center m-auto select-none">
                {nombre}
            </p>
        </div>
    </foreignObject>
</svg>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>