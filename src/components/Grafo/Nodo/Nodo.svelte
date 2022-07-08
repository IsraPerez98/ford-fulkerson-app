<script lang="ts">
    
    import type  Nodo  from '../../../interfaces/Nodo';

    export let nodo: Nodo;

    export let reposicionarAristas: Function;
    
    export let creandoArista: boolean;
    export let seleccionarNodoNuevaArista: Function;

    export let eliminandoNodo: boolean;
    export let eliminarNodo: Function;

    $: nombre = (nodo.nombre) ? nodo.nombre : `Nodo ${nodo.id}` ;

    const radio = 35;
    let color = 'bg-blue-700';

    let moviendo = false;

    let seleccionadoNuevaArista = false;

    $: {

        let colorNuevo = 'bg-blue-700';

        if(nodo.fuente) {
            colorNuevo = 'bg-green-700';
        }

        if(nodo.sumidero) {
            colorNuevo = 'bg-red-800';
        }
        
        if(!(creandoArista)) {
            seleccionadoNuevaArista = false;
        }

        if(eliminandoNodo) {
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
        console.log("Moviendo");
        moviendo = true;
    }

    function onMouseUp() {
        moviendo = false;
    }

    function onMouseMove(e) {
        if(moviendo) {
            nodo.x += e.movementX;
            nodo.y += e.movementY;
            //console.log({nodo});
            reposicionarAristas(nodo.id);
        }
    }
</script>

<svg x={nodo.x - radio} y={nodo.y - radio} width={radio * 2} height={radio * 2} on:mousedown={onMouseDown}>
    <foreignObject width={radio * 2} height={radio * 2}>
        <div class="cursor-pointer flex w-full h-full {color} rounded-full border border-white/20 overflow:hidden">
            <p class="text-white text-center m-auto select-none">
                {nombre}
            </p>
        </div>
    </foreignObject>
</svg>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>