<script lang="ts">

    import type Arista from "../../../classes/Arista";
    import type Posicion from "../../../interfaces/Posicion";
    import { beforeUpdate, afterUpdate } from 'svelte';

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";
    
    export let arista: Arista;
    let prevArista: {
        origenPos: Posicion,
        destinoPos: Posicion,

        esCamino: boolean[]; 
        peso: number[];
        flujo: number[];
        eliminandoArista: boolean;
    };

    $: eliminandoArista = arista.grafo.eliminandoArista;

    let dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );

    //console.log(arista.esCamino, arista.peso);

    function copiarValoresPrevArista() {
        prevArista = {
            origenPos: structuredClone(arista.origen.posicion),
            destinoPos: structuredClone(arista.destino.posicion),
            esCamino: structuredClone([...arista.esCamino]),
            peso: structuredClone([...arista.peso]),
            flujo: structuredClone([...arista.flujo]),
            eliminandoArista: structuredClone(eliminandoArista),
        };
    }


    function calcularColoresStroke() {
        let color1 = "stroke-emerald-600";
        let color2 = "stroke-blue-600";

        //las aristas se dibujan en sentido inverso
        if(arista.esCamino[1]) {
            //console.log(arista.flujo[0]);
            color1 = "stroke-yellow-300";
            if (!dibujarAristaBidireccional) {
                color2 = "stroke-yellow-300";
            }
        }
        if(arista.esCamino[0]) {
            //console.log(arista.flujo[1]);
            color2 = "stroke-yellow-300";
            if (!dibujarAristaBidireccional) {
                color1 = "stroke-yellow-300";
            }
        }

        if(eliminandoArista) {
            color1 = "stroke-gray-700";
            color2 = "stroke-gray-700";
        }

        return [color1, color2];
    }

    let coloresStroke = calcularColoresStroke();

    function calcularColoresFill() {
        let color1 = "fill-emerald-800";
        let color2 = "fill-blue-600";

        //las aristas se dibujan en sentido inverso
        if(arista.esCamino[1]) {
            color1 = "fill-yellow-300";
            if (!dibujarAristaBidireccional) {
                color2 = "fill-yellow-300";
            }
        }
        if(arista.esCamino[0]) {
            color2 = "fill-yellow-300";
            if (!dibujarAristaBidireccional) {
                color1 = "fill-yellow-300";
            }
        }

        if(eliminandoArista) {
            color1 = "fill-gray-700";
            color2 = "fill-gray-700";
        }


        return [color1, color2];
    }

    let coloresFill = calcularColoresFill();

    const bgPesoFlujo = "bg-yellow-300";

    function calcularColoresBG() {
        let color1 = "bg-emerald-800";
        let color2 = "bg-blue-600";

        if(eliminandoArista) {
            color1 = "bg-gray-700";
            color2 = "bg-gray-700";
        }
        
        /*
        if(arista.esCamino[0]) {
            color1 = "bg-yellow-300";
        }
        if(arista.esCamino[1]) {
            color2 = "bg-yellow-300";
        }
        */
        
        return [color1, color2];
    }

    let coloresBG = calcularColoresBG();


    function calcularParametros() {
        const posOrigen = arista.origen.posicion;
        const posDestino = arista.destino.posicion;

        const radioOrigen = arista.origen.radio;
        const radioDestino = arista.destino.radio;
        //calculamos el angulo de la linea
        const angulo = Math.atan2(posDestino.y - posOrigen.y, posDestino.x - posOrigen.x);

        //calculamos donde dibujar la linea para no tapar el vertice
        const x1 = posOrigen.x + radioOrigen * Math.cos(angulo);
        const y1 = posOrigen.y + radioOrigen * Math.sin(angulo);

        const x2 = posDestino.x - radioDestino * Math.cos(angulo);
        const y2 = posDestino.y - radioDestino * Math.sin(angulo);

        return {
            x1,
            y1,
            x2,
            y2,
            angulo
        };
    }

    let parametros = calcularParametros();

    function calcularPosicionPesos(): number[][] {
        if(dibujarAristaBidireccional) {
            //dibujamos los pesos con un 25% de distancia entre los vertices
            const distancia = 0.75;
            const x1 = parametros.x1 + (parametros.x2 - parametros.x1) * distancia;
            const y1 = parametros.y1 + (parametros.y2 - parametros.y1) * distancia;
            const x2 = parametros.x2 - (parametros.x2 - parametros.x1) * distancia;
            const y2 = parametros.y2 - (parametros.y2 - parametros.y1) * distancia;
            return [[x1, y1], [x2, y2]];
        } else {
            //dibujamos los pesos con al centro
            const x = (arista.destino.posicion.x + arista.origen.posicion.x) / 2;
            const y = (arista.destino.posicion.y + arista.origen.posicion.y) / 2;
            return [[x, y], [x, y]];
        }
    }

    let posicionPesos = calcularPosicionPesos();

    function calcularPosicionFlujo(): number[][] {
        const distancia = 40;
        const x1 = posicionPesos[0][0] + distancia * Math.cos(parametros.angulo + Math.PI / 2);
        const y1 = posicionPesos[0][1] + distancia * Math.sin(parametros.angulo + Math.PI / 2);
        
        const x2 = posicionPesos[1][0] + distancia * Math.cos(parametros.angulo + Math.PI / 2);
        const y2 = posicionPesos[1][1] + distancia * Math.sin(parametros.angulo + Math.PI / 2);

        return [[x1, y1], [x2, y2]];
    }

    let posicionFlujo = calcularPosicionFlujo();

    function updateArista(): void {
        //console.log("Recargando Arista ", arista);
        dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );
        parametros = calcularParametros();
        
        coloresStroke = calcularColoresStroke();
        coloresFill = calcularColoresFill();
        coloresBG = calcularColoresBG();
        
        posicionPesos = calcularPosicionPesos();
        posicionFlujo = calcularPosicionFlujo();
    }

    beforeUpdate(() => { //TODO: simplificar los ifs
        if(!prevArista) {
            copiarValoresPrevArista();
            updateArista();
            
            return;
        }

        //si se estan elimiando aristas
        if(eliminandoArista !== prevArista.eliminandoArista) {
            updateArista();
        }

        //si algun peso cambia 
        if(prevArista.peso[0] !== arista.peso[0] || prevArista.peso[1] !== arista.peso[1]) {
            updateArista();
        }

        //si se cambia la posicion del origen o del destino 
        const posOrigen = arista.origen.posicion;
        const posDestino = arista.destino.posicion;
        if(posOrigen.x !== prevArista.origenPos.x || posOrigen.y !== prevArista.origenPos.y || posDestino.x !== prevArista.destinoPos.x || posDestino.y !== prevArista.destinoPos.y) {
            updateArista();
        }

        //si cambia el estado de camino 
        if(prevArista.esCamino[0] !== arista.esCamino[0] || prevArista.esCamino[1] !== arista.esCamino[1]) {
            updateArista();
        }

        copiarValoresPrevArista();
        
    });


    function onClickArista() {
        if(eliminandoArista) {
            arista.eliminar();
            arista.grafo.finalizarEliminacionArista();
        }
    }



</script>
<svg>
    
    {#if dibujarAristaBidireccional} <!--Bidireccional-->
        <line 
            class="{coloresStroke[0]} stroke-2" 
            on:click={onClickArista}
            x1={parametros.x1} 
            y1={parametros.y1}
            x2={(parametros.x1 + parametros.x2) / 2}
            y2={(parametros.y1 + parametros.y2) / 2}
        >
        </line>

        <line 
            class="{coloresStroke[1]} stroke-2" 
            on:click={onClickArista}
            x1={(parametros.x1 + parametros.x2) / 2} 
            y1={(parametros.y1 + parametros.y2) / 2}
            x2={parametros.x2}
            y2={parametros.y2}
        >
        </line>

        <Flecha
            onClickArista={onClickArista}
            posicion={{x: parametros.x2, y: parametros.y2}}
            angulo={parametros.angulo + (Math.PI / 2)}
            fillColor="{coloresFill[1]}"
        />
        <Flecha
            onClickArista={onClickArista}
            posicion={{x: parametros.x1, y: parametros.y1}}
            angulo={parametros.angulo - (Math.PI / 2)}
            fillColor="{coloresFill[0]}"
        />

        <Peso
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionPesos[0][0],
                    y: posicionPesos[0][1],
                }
            }
            peso={arista.peso[0]}
            bgColor={coloresBG[1]}
            cambiarPeso={arista.cambiarPeso.bind(arista)}
        />
        <Peso
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionPesos[1][0],
                    y: posicionPesos[1][1],
                }
            }
            peso={arista.peso[1]}
            bgColor={coloresBG[0]}
            cambiarPeso={arista.cambiarPesoInverso.bind(arista)}
        />
    {:else} <!--Unidireccional-->
        <line 
            class="{coloresStroke[0]} stroke-2" 
            on:click={onClickArista}
            x1={parametros.x1}
            y1={parametros.y1} 
            x2={parametros.x2}
            y2={parametros.y2}
        >
        </line>

        {#if (arista.peso[0] !== 0)}
            <Flecha
                onClickArista={onClickArista}
                posicion={{x: parametros.x2, y: parametros.y2}}
                angulo={parametros.angulo + (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                onClickArista={onClickArista}
                posicion={
                    {
                        x: posicionPesos[0][0],
                        y: posicionPesos[0][1],
                    }
                }
                peso={arista.peso[0]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={arista.cambiarPeso.bind(arista)}
            />
        {:else}
            <Flecha
                onClickArista={onClickArista}
                posicion={{x: parametros.x1, y: parametros.y1}}
                angulo={parametros.angulo - (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                onClickArista={onClickArista}
                posicion={
                    {
                        x: posicionPesos[1][0],
                        y: posicionPesos[1][1],
                    }
                }
                peso={arista.peso[1]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={arista.cambiarPesoInverso.bind(arista)}
            />
        {/if}
    {/if } 

        <!--Dibujamos el flujo reutilizando el componente peso-->
    {#if arista.esCamino[0]}
        <Peso
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionFlujo[0][0],
                    y: posicionFlujo[0][1],
                }
            }
            peso={arista.flujo[0]}
            bgColor={bgPesoFlujo}
            textColor={"text-black"}
        />
    {/if}
    {#if arista.esCamino[1]}
        <Peso
            onClickArista={onClickArista}
            posicion={
                {
                    x: posicionFlujo[1][0],
                    y: posicionFlujo[1][1],
                }
            }
            peso={arista.flujo[1]}
            bgColor={bgPesoFlujo}
            textColor={"text-black"}
        />
    {/if}
</svg>
