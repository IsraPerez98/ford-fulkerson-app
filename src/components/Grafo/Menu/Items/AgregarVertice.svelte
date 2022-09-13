<script lang="ts">

    export let agregarVertice: Function;
    export let getPosicionSVG: Function;
    
    const radio = 35;
    
    let moviendo = false;

    let posicion = {
        x: 0,
        y: 0,
    };

    let divNuevoVertice: HTMLDivElement;

    function onMouseDown() {
        //console.log("MOVIENDO");
        moviendo = true;
    }

    function onMouseUp() {

        if(moviendo) {
            //calculamos la posicion dentro del svg
            let posicionSVG = getPosicionSVG();

            const posicionNuevoVertice = {
                x: divNuevoVertice.getBoundingClientRect().x - posicionSVG.x + radio,
                y: divNuevoVertice.getBoundingClientRect().y - posicionSVG.y - (radio * 2),
            }

            agregarVertice(posicionNuevoVertice.x, posicionNuevoVertice.y);

            //reiniciamos la posicion
            moviendo = false;
            posicion.x = 0;
            posicion.y = 0;
        }
    }

    function onMouseMove(e) {
        if(moviendo) {
            posicion.x += e.movementX;
            posicion.y += e.movementY;
            
            //console.log({posicion});
        }
    }

</script>


<div bind:this={divNuevoVertice} style:position="relative" style:width="{radio*2}px" style:height="{radio*2}px" style:left="{posicion.x}px" style:top="{posicion.y}px" on:mousedown={onMouseDown}>
    <div class="cursor-pointer flex w-full h-full bg-blue-700 rounded-full border border-white/20 overflow:hidden" >
        <p class="text-white text-center m-auto select-none">
            Nuevo Vertice
        </p>
    </div>
</div>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp}/>