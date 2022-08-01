<script lang="ts">
import { onDestroy } from "svelte";

    import type Arista from "../../../interfaces/Arista";

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";
    
    export let arista: Arista;
    let prevArista: Arista;


    export let nodosMovidos: Set<Number>;
    export let cambiarPeso: Function;

    let dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );

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

        prevArista = arista;
    }
    

    $: if(nodosMovidos) {
        if(nodosMovidos.has(arista.origen.id) || nodosMovidos.has(arista.destino.id)) {
            //console.log("Moviendo arista "+ arista.desde.id + "-" + arista.hasta.id);
            parametros = calcularParametros();
        }
    }

</script>
<svg>
    {#if dibujarAristaBidireccional} <!--Bidireccional-->
        <line 
            class="stroke-emerald-600 stroke-2" 
            x1={parametros.x1} 
            y1={parametros.y1}
            x2={(parametros.x1 + parametros.x2) / 2}
            y2={(parametros.y1 + parametros.y2) / 2}
        >
        </line>

        <line 
            class="stroke-rose-500 stroke-2" 
            x1={(parametros.x1 + parametros.x2) / 2} 
            y1={(parametros.y1 + parametros.y2) / 2}
            x2={parametros.x2}
            y2={parametros.y2}
        >
        </line>

        <Flecha
            posicion={{x: parametros.x1, y: parametros.y1}}
            angulo={parametros.angulo - (Math.PI / 2)}
            fillColor={'fill-emerald-800'}
        />
        <Flecha
            posicion={{x: parametros.x2, y: parametros.y2}}
            angulo={parametros.angulo + (Math.PI / 2)}
            fillColor={'fill-rose-800'}
        />

        <Peso
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
    {:else} <!--Unidireccional-->
        <line 
            class="stroke-emerald-600 stroke-2" 
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
                fillColor={'fill-emerald-800'}
            />
            <Peso
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
        {:else}
            <Flecha
                posicion={{x: parametros.x2, y: parametros.y2}}
                angulo={parametros.angulo + (Math.PI / 2)}
                fillColor={'fill-emerald-800'}
            />
            <Peso
                posicion={
                    {
                        x: (parametros.x1 + parametros.x2) / 2  - 20 * Math.cos(parametros.angulo),
                        y: (parametros.y1 + parametros.y2) / 2 - 20 * Math.sin(parametros.angulo),
                    }
                }
                nodoDesde={arista.destino}
                nodoHasta={arista.origen}
                peso={arista.peso[1]}
                bgColor={'bg-emerald-800'}
                cambiarPeso={cambiarPeso}
            />
        {/if}
    {/if } 
</svg>
