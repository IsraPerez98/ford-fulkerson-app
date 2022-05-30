<script lang="ts">
    import { onMount } from "svelte";
    import type Arista from "../../../interfaces/Arista";

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";

    export let svggrafo: any;
    export let arista: Arista;
    export let cambiarPeso: Function;

    const dibujarAristaBidireccional = ( arista.peso !== 0 && arista.pesoInverso !== 0 );

    let svgarista: any;
    let linea: any;
    let linea2: any;

    $: if(svggrafo) {
        draw();
    }

    let parametros = calcularParametros();

    function calcularParametros() {
        const radioNodo = 35;
        //calculamos el angulo de la linea
        const angulo = Math.atan2(arista.hasta.posY - arista.desde.posY, arista.hasta.posX - arista.desde.posX);

        //calculamos donde dibujar la linea para no tapar el nodo
        const x1 = arista.desde.posX + radioNodo * Math.cos(angulo);
        const y1 = arista.desde.posY + radioNodo * Math.sin(angulo);

        const x2 = arista.hasta.posX - radioNodo * Math.cos(angulo);
        const y2 = arista.hasta.posY - radioNodo * Math.sin(angulo);

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
        parametros = calcularParametros();
        if(svgarista) {
            reposicionarArista();
        }
    }

    onMount(() => {
        draw();
    });

    
    function draw() {
        if(!svggrafo || !arista) {
            return;
        }

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
    <Flecha
        svgarista={svgarista}
        posicion={{x: parametros.x1, y: parametros.y1}}
        angulo={parametros.angulo - (Math.PI / 2)}
        fillColor={'fill-emerald-800'}
    />
{/if}

{#if dibujarAristaBidireccional}
    <Peso
        svgarista={svgarista}
        posicion={
            {
                x: (parametros.x1 + parametros.x2) / 2 - 20,
                y: (parametros.y1 + parametros.y2) / 2
            }
        }
        nodoDesde={arista.desde}
        nodoHasta={arista.hasta}
        peso={arista.peso}
        bgColor={'bg-emerald-800'}
        cambiarPeso={cambiarPeso}
    />
    <Peso
        svgarista={svgarista}
        posicion={
            {
                x: (parametros.x1 + parametros.x2) / 2 + 20,
                y: (parametros.y1 + parametros.y2) / 2
            }
        }
        nodoDesde={arista.hasta}
        nodoHasta={arista.desde}
        peso={arista.pesoInverso}
        bgColor={'bg-rose-800'}
        cambiarPeso={cambiarPeso}
    />
{:else}
    {#if (arista.peso != 0)}
        <Peso
            svgarista={svgarista}
            posicion={
                {
                    x: (parametros.x1 + parametros.x2) / 2,
                    y: (parametros.y1 + parametros.y2) / 2
                }
            }
            nodoDesde={arista.desde}
            nodoHasta={arista.hasta}
            peso={arista.peso}
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
        nodoDesde={arista.hasta}
        nodoHasta={arista.desde}
        peso={arista.pesoInverso}
        bgColor={'bg-emerald-800'}
        cambiarPeso={cambiarPeso}
        />
    {/if}
{/if}