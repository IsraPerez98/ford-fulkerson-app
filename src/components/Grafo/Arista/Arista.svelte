<script lang="ts">
import { onDestroy } from "svelte";

    import type Arista from "../../../interfaces/Arista";

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";
    
    export let arista: Arista;
    let prevArista: Arista;


    export let verticesMovidos: Set<Number>;
    export let cambiarPeso: Function;

    let dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );

    console.log(arista.esCamino, arista.peso);

    let parametros = calcularParametros();

    function calcularColoresStroke() {
        let color1 = "stroke-emerald-600";
        let color2 = "stroke-rose-500";
        if(arista.esCamino[0]) {
            color1 = "stroke-blue-800";
        }
        if(arista.esCamino[1]) {
            color2 = "stroke-blue-800";
        }
        return [color1, color2];
    }

    let coloresStroke = calcularColoresStroke();

    function calcularColoresFill() {
        let color1 = "fill-emerald-800";
        let color2 = "fill-rose-800";
        if(arista.esCamino[0]) {
            color1 = "fill-blue-800";
        }
        if(arista.esCamino[1]) {
            color2 = "fill-blue-800";
        }
        return [color1, color2];
    }

    let coloresFill = calcularColoresFill();

    function calcularColoresBG() {
        let color1 = "bg-emerald-800";
        let color2 = "bg-rose-800";
        if(arista.esCamino[0]) {
            color1 = "bg-blue-800";
        }
        if(arista.esCamino[1]) {
            color2 = "bg-blue-800";
        }
        return [color1, color2];
    }

    let coloresBG = calcularColoresBG();


    function calcularParametros() {
        const radioVertice = 35;
        //calculamos el angulo de la linea
        const angulo = Math.atan2(arista.destino.y - arista.origen.y, arista.destino.x - arista.origen.x);

        //calculamos donde dibujar la linea para no tapar el vertice
        const x1 = arista.origen.x + radioVertice * Math.cos(angulo);
        const y1 = arista.origen.y + radioVertice * Math.sin(angulo);

        const x2 = arista.destino.x - radioVertice * Math.cos(angulo);
        const y2 = arista.destino.y - radioVertice * Math.sin(angulo);

        return {
            x1,
            y1,
            x2,
            y2,
            angulo
        };
    }

    $: if(arista) {
        if(prevArista) {
            //si algun peso cambia de valor redibujamos la arista
            if(prevArista.peso[0] !== arista.peso[0] || prevArista.peso[1] !== arista.peso[1]) {
                //console.log("Cambio peso", arista, prevArista);
                dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );
                parametros = calcularParametros();

            }
        }
        parametros = calcularParametros();
        coloresStroke = calcularColoresStroke();
        coloresFill = calcularColoresFill();
        coloresBG = calcularColoresBG();

        prevArista = arista;
    }
    

    $: if(verticesMovidos) {
        if(verticesMovidos.has(arista.origen.id) || verticesMovidos.has(arista.destino.id)) {
            //console.log("Moviendo arista "+ arista.desde.id + "-" + arista.hasta.id);
            parametros = calcularParametros();
        }
    }

</script>
<svg>
    
    {#if dibujarAristaBidireccional} <!--Bidireccional-->
        <line 
            class="{coloresStroke[0]} stroke-2" 
            x1={parametros.x1} 
            y1={parametros.y1}
            x2={(parametros.x1 + parametros.x2) / 2}
            y2={(parametros.y1 + parametros.y2) / 2}
        >
        </line>

        <line 
            class="{coloresStroke[1]} stroke-2" 
            x1={(parametros.x1 + parametros.x2) / 2} 
            y1={(parametros.y1 + parametros.y2) / 2}
            x2={parametros.x2}
            y2={parametros.y2}
        >
        </line>

        <Flecha
            posicion={{x: parametros.x1, y: parametros.y1}}
            angulo={parametros.angulo - (Math.PI / 2)}
            fillColor="{coloresFill[0]}"
        />
        <Flecha
            posicion={{x: parametros.x2, y: parametros.y2}}
            angulo={parametros.angulo + (Math.PI / 2)}
            fillColor="{coloresFill[1]}"
        />

        <Peso
            posicion={
                {
                    x: (parametros.x1 + parametros.x2) / 2  - 20 * Math.cos(parametros.angulo),
                    y: (parametros.y1 + parametros.y2) / 2 - 20 * Math.sin(parametros.angulo),
                }
            }
            verticeDesde={arista.origen}
            verticeHasta={arista.destino}
            peso={arista.peso[0]}
            bgColor="{coloresBG[0]}"
            cambiarPeso={cambiarPeso}
        />
        <Peso
            posicion={
                {
                    x: (parametros.x1 + parametros.x2) / 2  + 20 * Math.cos(parametros.angulo),
                    y: (parametros.y1 + parametros.y2) / 2 + 20 * Math.sin(parametros.angulo),
                }
            }
            verticeDesde={arista.destino}
            verticeHasta={arista.origen}
            peso={arista.peso[1]}
            bgColor="{coloresBG[1]}"
            cambiarPeso={cambiarPeso}
        />
    {:else} <!--Unidireccional-->
        <line 
            class="{coloresStroke[0]} stroke-2" 
            x1={parametros.x1}
            y1={parametros.y1} 
            x2={parametros.x2}
            y2={parametros.y2}
        >
        </line>

        {#if (arista.peso[0] != 0)}
            <Flecha
                posicion={{x: parametros.x1, y: parametros.y1}}
                angulo={parametros.angulo - (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                posicion={
                    {
                        x: (parametros.x1 + parametros.x2) / 2  - 20 * Math.cos(parametros.angulo),
                        y: (parametros.y1 + parametros.y2) / 2 - 20 * Math.sin(parametros.angulo),
                    }
                }
                verticeDesde={arista.origen}
                verticeHasta={arista.destino}
                peso={arista.peso[0]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={cambiarPeso}
            />
        {:else}
            <Flecha
                posicion={{x: parametros.x2, y: parametros.y2}}
                angulo={parametros.angulo + (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                posicion={
                    {
                        x: (parametros.x1 + parametros.x2) / 2  - 20 * Math.cos(parametros.angulo),
                        y: (parametros.y1 + parametros.y2) / 2 - 20 * Math.sin(parametros.angulo),
                    }
                }
                verticeDesde={arista.destino}
                verticeHasta={arista.origen}
                peso={arista.peso[1]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={cambiarPeso}
            />
        {/if}
    {/if } 
</svg>
