<script lang="ts">
import { onDestroy } from "svelte";

    import type Arista from "../../../interfaces/Arista";

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";

    export let svggrafo: any;
    
    export let arista: Arista;
    let prevArista: Arista;


    export let nodosMovidos: Set<Number>;
    export let cambiarPeso: Function;

    let dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );

    let svgarista: any;
    let linea: any;
    let linea2: any;

    onDestroy(() => {
        if(svgarista) {
            svgarista.remove();
        }
    });

    $: if(svggrafo) {
        draw();
    }

    let parametros = calcularParametros();

    function calcularParametros() {
        const radioNodo = 35;
        //calculamos el angulo de la linea
        const angulo = Math.atan2(arista.destino.y - arista.origen.y, arista.destino.x - arista.origen.x);

        //calculamos donde dibujar la linea para no tapar el nodo
        const x1 = arista.origen.x + radioNodo * Math.cos(angulo);
        const y1 = arista.origen.y + radioNodo * Math.sin(angulo);

        const x2 = arista.destino.x - radioNodo * Math.cos(angulo);
        const y2 = arista.destino.y - radioNodo * Math.sin(angulo);

        return {
            x1,
            y1,
            x2,
            y2,
            angulo
        };
    }

    function reposicionarArista() {
        svgarista
            .attr("x1", parametros.x1)
            .attr("y1", parametros.y1)
            .attr("x2", parametros.x2)
            .attr("y2", parametros.y2);

        if(dibujarAristaBidireccional) {
            linea
                .attr("x1", parametros.x1)
                .attr("y1", parametros.y1)
                .attr("x2", (parametros.x1 + parametros.x2) / 2)
                .attr("y2", (parametros.y1 + parametros.y2) / 2);
            
            linea2
                .attr("x1", (parametros.x1 + parametros.x2) / 2)
                .attr("y1", (parametros.y1 + parametros.y2) / 2)
                .attr("x2", parametros.x2)
                .attr("y2", parametros.y2);
        } else {
            linea
                .attr("x1", parametros.x1)
                .attr("y1", parametros.y1)
                .attr("x2", parametros.x2)
                .attr("y2", parametros.y2);
        }
    }

    $: if(arista) {
        if(prevArista) {
            //si algun peso cambia de valor redibujamos la arista
            if(prevArista.peso[0] !== arista.peso[0] || prevArista.peso[1] !== arista.peso[1]) {
                //console.log("Cambio peso", arista, prevArista);
                dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );
                parametros = calcularParametros();
                draw();
            }
        }
        parametros = calcularParametros();
        if(svgarista) {
            reposicionarArista();
        }

        prevArista = arista;
    }
    

    $: if(nodosMovidos) {
        if(nodosMovidos.has(arista.origen.id) || nodosMovidos.has(arista.destino.id)) {
            //console.log("Moviendo arista "+ arista.desde.id + "-" + arista.hasta.id);
            parametros = calcularParametros();
            if(svgarista) {
                reposicionarArista();
            }
        }
    }

    
    function draw() {
        if(!svggrafo || !arista) {
            return;
        }

        console.log("Dibujando arista "+ arista.origen.id + "-" + arista.destino.id);

        if(svgarista){
            svgarista.remove();
        }

        svgarista = svggrafo.append("svg")
            .attr("x1", parametros.x1)
            .attr("y1", parametros.y1)
            .attr("x2", parametros.x2)
            .attr("y2", parametros.y2);

        
        if(dibujarAristaBidireccional) {
            linea = svgarista.append("line")
                .attr("class", "stroke-emerald-500 stroke-2")
                .attr("x1", parametros.x1)
                .attr("y1", parametros.y1)
                .attr("x2", (parametros.x1 + parametros.x2) / 2)
                .attr("y2", (parametros.y1 + parametros.y2) / 2);
            
            linea2 = svgarista.append("line")
                .attr("class", "stroke-rose-500 stroke-2")
                .attr("x1", (parametros.x1 + parametros.x2) / 2)
                .attr("y1", (parametros.y1 + parametros.y2) / 2)
                .attr("x2", parametros.x2)
                .attr("y2", parametros.y2);
        
        } else {
            linea = svgarista.append("line")
                .attr("class", "stroke-emerald-500 stroke-2")
                .attr("x1", parametros.x1)
                .attr("y1", parametros.y1)
                .attr("x2", parametros.x2)
                .attr("y2", parametros.y2);
        }
    }

</script>

{#if dibujarAristaBidireccional}
    <Flecha
        svgarista={svgarista}
        posicion={{x: parametros.x1, y: parametros.y1}}
        angulo={parametros.angulo - (Math.PI / 2)}
        fillColor={'fill-emerald-800'}
    />
    <Flecha
        svgarista={svgarista}
        posicion={{x: parametros.x2, y: parametros.y2}}
        angulo={parametros.angulo + (Math.PI / 2)}
        fillColor={'fill-rose-800'}
    /> 
{:else}
    {#if (arista.peso[0] != 0)}
        <Flecha
            svgarista={svgarista}
            posicion={{x: parametros.x1, y: parametros.y1}}
            angulo={parametros.angulo - (Math.PI / 2)}
            fillColor={'fill-emerald-800'}
        />
    {:else}
        <Flecha
            svgarista={svgarista}
            posicion={{x: parametros.x2, y: parametros.y2}}
            angulo={parametros.angulo + (Math.PI / 2)}
            fillColor={'fill-emerald-800'}
        />
    {/if}
{/if}

{#if dibujarAristaBidireccional}
    <Peso
        svgarista={svgarista}
        posicion={
            {
                x: (parametros.x1 + parametros.x2) / 2  - 20 * Math.cos(parametros.angulo),
                y: (parametros.y1 + parametros.y2) / 2 - 20 * Math.sin(parametros.angulo),
            }
        }
        nodoDesde={arista.origen}
        nodoHasta={arista.destino}
        peso={arista.peso[0]}
        bgColor={'bg-emerald-800'}
        cambiarPeso={cambiarPeso}
    />
    <Peso
        svgarista={svgarista}
        posicion={
            {
                x: (parametros.x1 + parametros.x2) / 2  + 20 * Math.cos(parametros.angulo),
                y: (parametros.y1 + parametros.y2) / 2 + 20 * Math.sin(parametros.angulo),
            }
        }
        nodoDesde={arista.destino}
        nodoHasta={arista.origen}
        peso={arista.peso[1]}
        bgColor={'bg-rose-800'}
        cambiarPeso={cambiarPeso}
    />
{:else}
    {#if (arista.peso[0] !== 0)}
        <Peso
            svgarista={svgarista}
            posicion={
                {
                    x: (parametros.x1 + parametros.x2) / 2,
                    y: (parametros.y1 + parametros.y2) / 2
                }
            }
            nodoDesde={arista.origen}
            nodoHasta={arista.destino}
            peso={arista.peso[0]}
            bgColor={'bg-emerald-800'}
            cambiarPeso={cambiarPeso}
        />
    {:else}
        <Peso
        svgarista={svgarista}
        posicion={
            {
                x: (parametros.x1 + parametros.x2) / 2,
                y: (parametros.y1 + parametros.y2) / 2
            }
        }
        nodoDesde={arista.destino}
        nodoHasta={arista.origen}
        peso={arista.peso[1]}
        bgColor={'bg-emerald-800'}
        cambiarPeso={cambiarPeso}
        />
    {/if}
{/if}