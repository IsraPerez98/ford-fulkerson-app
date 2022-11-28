<script lang="ts">

    import type Arista from "../../../classes/Arista";
    import type Posicion from "../../../interfaces/Posicion";
    import { beforeUpdate, afterUpdate } from 'svelte';

    import Flecha from "./Flecha.svelte";
    import Capacidad from "./Capacidad.svelte";

    export let arista: Arista | null;
    export let aristaInversa: Arista | null;

    $: aristaInversa = arista === aristaInversa ? null : aristaInversa;

    $: aristaBidireccional = (arista && aristaInversa);
    $: aristaPrincipal = arista || aristaInversa;

    $: eliminandoArista = aristaPrincipal.grafo.eliminandoArista;
    let prevEliminandoArista = eliminandoArista;

    $: fnCambiarCapacidad = ( arista && arista.grafo && !arista.grafo.eliminandoArista ) ? arista.cambiarCapacidad.bind(arista) :  null;
    $: fnCambiarCapacidadInversa = ( aristaInversa && aristaInversa.grafo && !aristaInversa.grafo.eliminandoArista ) ? aristaInversa.cambiarCapacidad.bind(aristaInversa) :  null;

    let posicionesArista: {
        inicio: Posicion,
        puntoMedio: Posicion,
        final: Posicion,
        angulo: number,
    };

    let posicionesCapacidades: {
        posicionCapacidad: Posicion,
        posicionCapacidadInversa: Posicion,
    };

    let posicionesFlujos: {
        posicionFlujo: Posicion,
        posicionFlujoInverso: Posicion,
    };

    let colores: {
        coloresStroke: {
            color: string,
            colorInverso: string,
        },
        coloresFill: {
            color: string,
            colorInverso: string,
        },
        coloresBG: {
            color: string,
            colorInverso: string,
        },
    };

    const bgCapacidadFlujo = "bg-yellow-300";

    let prevArista: {
        origenPos: Posicion,
        destinoPos: Posicion,

        esCamino: boolean,
        capacidad: number,
        flujo: number,
    }

    let prevAristaInversa: {
        origenPos: Posicion,
        destinoPos: Posicion,

        esCamino: boolean,
        capacidad: number,
        flujo: number,
    }

    function copiarValoresPrevArista(): void {
        prevEliminandoArista = eliminandoArista;
        if(arista) {
            prevArista = {
                origenPos: arista.origen.posicion,
                destinoPos: arista.destino.posicion,

                esCamino: arista.esCamino,
                capacidad: arista.capacidad,
                flujo: arista.flujo,
            }
        }
        if(aristaInversa) {
            prevAristaInversa = {
                origenPos: aristaInversa.origen.posicion,
                destinoPos: aristaInversa.destino.posicion,

                esCamino: aristaInversa.esCamino,
                capacidad: aristaInversa.capacidad,
                flujo: aristaInversa.flujo,
            }
        }
    }

    const coloresStroke = {
        "normal": "stroke-emerald-600",
        "inverso": "stroke-blue-600",
        "camino": "stroke-yellow-500 dark:stroke-yellow-300",
        "fueCamino": "stroke-gray-600",
        "eliminando": "stroke-gray-700",
    }

    function calcularColoresStroke() : {color: string, colorInverso: string} {
        let color = coloresStroke.normal;
        let colorInverso = aristaBidireccional ? coloresStroke.inverso : coloresStroke.normal;
        
        if(arista && arista.esCamino) {
            color = coloresStroke.camino;
        }
        if(aristaInversa && aristaInversa.esCamino) {
            colorInverso = coloresStroke.camino;
        }

        if(arista && arista.fueCamino) {
            color = coloresStroke.fueCamino;
        }

        if(aristaInversa && aristaInversa.fueCamino) {
            colorInverso = coloresStroke.fueCamino;
        }

        if(eliminandoArista) {
            color = coloresStroke.eliminando;
            colorInverso = coloresStroke.eliminando;
        }

        return {color, colorInverso};
    }

    const coloresFill = {
        "normal": "fill-emerald-600",
        "inverso": "fill-blue-600",
        "camino": "fill-yellow-500 dark:fill-yellow-300",
        "fueCamino": "fill-gray-600",
        "eliminando": "fill-gray-700",
    }

    function calcularColoresFill() : {color: string, colorInverso: string} {
        let color = coloresFill.normal;
        let colorInverso = aristaBidireccional ? coloresFill.inverso : coloresFill.normal;
        
        if(arista && arista.esCamino) {
            color = coloresFill.camino;
        }
        if(aristaInversa && aristaInversa.esCamino) {
            colorInverso = coloresFill.camino;
        }

        if(arista && arista.fueCamino) {
            color = coloresFill.fueCamino;
        }

        if(aristaInversa && aristaInversa.fueCamino) {
            colorInverso = coloresFill.fueCamino;
        }

        if(eliminandoArista) {
            color = coloresFill.eliminando;
            colorInverso = coloresFill.eliminando;
        }

        return {color, colorInverso};
    }

    const coloresBG = {
        "normal": "bg-emerald-800",
        "inverso": "bg-blue-600",
        "eliminando": "bg-gray-700",
        "flujo": "bg-orange-700",
        "flujoCompleto": "bg-rose-700",
    }

    function calcularColoresBG() : {color: string, colorInverso: string} {
        let color = coloresBG.normal;
        let colorInverso = aristaBidireccional ? coloresBG.inverso : coloresBG.normal;
        
        if(arista && arista.flujo !== 0) {
            color = coloresBG.flujo;
        }

        if(aristaInversa && aristaInversa.flujo !== 0) {
            colorInverso = coloresBG.flujo;
        }

        if(arista && arista.flujo === arista.capacidad) {
            color = coloresBG.flujoCompleto;
        }

        if(aristaInversa && aristaInversa.flujo === aristaInversa.capacidad) {
            colorInverso = coloresBG.flujoCompleto;
        }

        if(eliminandoArista) {
            color = coloresBG.eliminando;
            colorInverso = coloresBG.eliminando;
        }

        return {color, colorInverso};
    }

    function calcularPosicionesArista() : { inicio: Posicion, puntoMedio: Posicion, final: Posicion, angulo: number} {
        const posOrigen = aristaPrincipal.origen.posicion;
        const posDestino = aristaPrincipal.destino.posicion;

        const radioOrigen = aristaPrincipal.origen.radio;
        const radioDestino = aristaPrincipal.destino.radio;

        const angulo = Math.atan2(posDestino.y - posOrigen.y, posDestino.x - posOrigen.x);

        const inicio = {
            x: posOrigen.x + radioOrigen * Math.cos(angulo),
            y: posOrigen.y + radioOrigen * Math.sin(angulo),
        };

        const final = {
            x: posDestino.x - radioDestino * Math.cos(angulo),
            y: posDestino.y - radioDestino * Math.sin(angulo),
        };

        const puntoMedio = {
            x: (inicio.x + final.x) / 2,
            y: (inicio.y + final.y) / 2,
        };

        return {inicio, puntoMedio, final, angulo};
    }

    function calcularPosicionesCapacidades() : {posicionCapacidad: Posicion, posicionCapacidadInversa: Posicion} {
        if(aristaBidireccional) {
            const distancia = 0.75;
            const posicionCapacidad = {
                x: posicionesArista.inicio.x + ( posicionesArista.final.x - posicionesArista.inicio.x ) * distancia,
                y: posicionesArista.inicio.y + ( posicionesArista.final.y - posicionesArista.inicio.y ) * distancia,
            };

            const posicionCapacidadInversa = {
                x: posicionesArista.final.x - ( posicionesArista.final.x - posicionesArista.inicio.x ) * distancia,
                y: posicionesArista.final.y - ( posicionesArista.final.y - posicionesArista.inicio.y ) * distancia,
            };

            return {posicionCapacidad: posicionCapacidad, posicionCapacidadInversa: posicionCapacidadInversa};
        }

        const puntoMedio = posicionesArista.puntoMedio;

        return {posicionCapacidad: puntoMedio, posicionCapacidadInversa: puntoMedio};
    }

    function calcularPosicionFlujos(): {posicionFlujo: Posicion, posicionFlujoInverso: Posicion} {
        const diametro = 20 * 2;

        const posicionFlujo = {
            x: posicionesCapacidades.posicionCapacidad.x + diametro * Math.cos(posicionesArista.angulo + Math.PI / 2),
            y: posicionesCapacidades.posicionCapacidad.y + diametro * Math.sin(posicionesArista.angulo + Math.PI / 2),
        }

        const posicionFlujoInverso = {
            x: posicionesCapacidades.posicionCapacidadInversa.x + diametro * Math.cos(posicionesArista.angulo + Math.PI / 2),
            y: posicionesCapacidades.posicionCapacidadInversa.y + diametro * Math.sin(posicionesArista.angulo + Math.PI / 2),
        }

        return {posicionFlujo, posicionFlujoInverso};
    }

    function updateArista(): void {
        posicionesArista = calcularPosicionesArista();
        posicionesCapacidades = calcularPosicionesCapacidades();
        posicionesFlujos = calcularPosicionFlujos();

        const coloresStroke = calcularColoresStroke();
        const coloresFill = calcularColoresFill();
        const coloresBG = calcularColoresBG();

        colores = {
            coloresStroke,
            coloresFill,
            coloresBG,
        };
    }

    beforeUpdate(() => {
        if(!prevArista && !prevAristaInversa) {
            copiarValoresPrevArista();
            updateArista();
            return;
        }

        //actualizamos los valores de la arista representada
        if(

        //si se inicia o finaliza la eliminacion de aristas
        (prevEliminandoArista && !eliminandoArista) || (!prevEliminandoArista && eliminandoArista) ||
        
        //si se crea una arista
        (!prevArista && arista || !prevAristaInversa && aristaInversa) ||
        
        //si se elimina una arista
        (prevArista && !arista || prevAristaInversa && !aristaInversa) ||

        // si se cambia la capacidad
        (prevArista && arista && prevArista.capacidad !== arista.capacidad) ||
        (prevAristaInversa && aristaInversa && prevAristaInversa.capacidad !== aristaInversa.capacidad) ||


        //si se cambia el flujo
        (prevArista && arista && prevArista.flujo !== arista.flujo) ||
        (prevAristaInversa && aristaInversa && prevAristaInversa.flujo !== aristaInversa.flujo) ||


        //si cambia el estado de camino
        (prevArista && arista && prevArista.esCamino !== arista.esCamino) ||
        (prevAristaInversa && aristaInversa && prevAristaInversa.esCamino !== aristaInversa.esCamino) ||

        //si cambia la posicion de un vertice
        (prevArista && arista && (prevArista.origenPos.x !== arista.origen.posicion.x || prevArista.origenPos.y !== arista.origen.posicion.y || prevArista.destinoPos.x !== arista.destino.posicion.x || prevArista.destinoPos.y !== arista.destino.posicion.y)) ||
        (prevAristaInversa && aristaInversa && (prevAristaInversa.origenPos.x !== aristaInversa.origen.posicion.x || prevAristaInversa.origenPos.y !== aristaInversa.origen.posicion.y || prevAristaInversa.destinoPos.x !== aristaInversa.destino.posicion.x || prevAristaInversa.destinoPos.y !== aristaInversa.destino.posicion.y)) 
        
        )
        {
            copiarValoresPrevArista();
            updateArista();
            return;
        }

    });

    function onClickArista() {
        if(eliminandoArista) {
            if(arista) {
                arista.eliminar();
            }
            if(aristaInversa) {
                aristaInversa.eliminar();
            }

            aristaPrincipal.grafo.finalizarEliminacionArista();
        }
    }

</script>

<svg>
    {#if aristaBidireccional}
        <line
            class="{colores.coloresStroke.colorInverso} stroke-2"
            on:click={onClickArista}
            x1={posicionesArista.inicio.x}
            y1={posicionesArista.inicio.y}
            x2={posicionesArista.puntoMedio.x}
            y2={posicionesArista.puntoMedio.y}
        />

        <line
            class="{colores.coloresStroke.color} stroke-2"
            on:click={onClickArista}
            x1={posicionesArista.puntoMedio.x}
            y1={posicionesArista.puntoMedio.y}
            x2={posicionesArista.final.x}
            y2={posicionesArista.final.y}
        />

        <Flecha
            onClickArista={onClickArista}
            posicion={posicionesArista.inicio}
            angulo={posicionesArista.angulo - (Math.PI / 2)}
            fillColor={colores.coloresFill.colorInverso}
        />

        <Flecha
            onClickArista={onClickArista}
            posicion={posicionesArista.final}
            angulo={posicionesArista.angulo + (Math.PI / 2)}
            fillColor={colores.coloresFill.color}
        />

        <Capacidad
            onClickArista={onClickArista}
            posicion={posicionesCapacidades.posicionCapacidad}
            capacidad={arista.capacidad}
            bgColor={colores.coloresBG.color}
            cambiarCapacidad={fnCambiarCapacidad}
        />

        <Capacidad
            onClickArista={onClickArista}
            posicion={posicionesCapacidades.posicionCapacidadInversa}
            capacidad={aristaInversa.capacidad}
            bgColor={colores.coloresBG.colorInverso}
            cambiarCapacidad={fnCambiarCapacidadInversa}
        />
    {:else} <!--Unidireccional-->
        <line
            class="{arista === aristaPrincipal ? colores.coloresStroke.color : colores.coloresStroke.colorInverso} stroke-2"
            on:click={onClickArista}
            x1={posicionesArista.inicio.x}
            y1={posicionesArista.inicio.y}
            x2={posicionesArista.final.x}
            y2={posicionesArista.final.y}
        />

        <Flecha
            onClickArista={onClickArista}
            posicion={posicionesArista.final}
            angulo={posicionesArista.angulo + (Math.PI / 2)}
            fillColor={arista === aristaPrincipal ? colores.coloresFill.color : colores.coloresFill.colorInverso}
        />

        <Capacidad
            onClickArista={onClickArista}
            posicion={posicionesCapacidades.posicionCapacidad}
            capacidad={aristaPrincipal.capacidad}
            bgColor={arista === aristaPrincipal ? colores.coloresBG.color : colores.coloresBG.colorInverso}
            cambiarCapacidad={arista === aristaPrincipal ? fnCambiarCapacidad : fnCambiarCapacidadInversa}
        />
    {/if}

    <!--Dibujamos el flujo reutilizando el componente de la capacidad -->
    {#if arista && (arista.esCamino || arista.fueCamino)}
        <Capacidad
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionesFlujos.posicionFlujo.x,
                    y: posicionesFlujos.posicionFlujo.y,
                }
            }
            capacidad={arista.flujo}
            bgColor={bgCapacidadFlujo}
            textColor={"text-black"}
            dibujarCero={false}
        />
    {/if}
    {#if aristaInversa && (aristaInversa.esCamino || aristaInversa.fueCamino)}
        <Capacidad
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionesFlujos.posicionFlujoInverso.x,
                    y: posicionesFlujos.posicionFlujoInverso.y,
                }
            }
            capacidad={aristaInversa.flujo}
            bgColor={bgCapacidadFlujo}
            textColor={"text-black"}
            dibujarCero={false}
        />
    {/if}
</svg>