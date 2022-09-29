<script lang="ts">

    import type Arista from "../../../classes/Arista";
    import { beforeUpdate, afterUpdate } from 'svelte';

    import Flecha from "./Flecha.svelte";
    import Peso from "./Peso.svelte";
    
    export let arista: Arista;
    let prevArista: Arista;

    let dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );

    //console.log(arista.esCamino, arista.peso);


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
        return [color1, color2];
    }

    let coloresFill = calcularColoresFill();

    const bgPesoFlujo = "bg-yellow-300";

    function calcularColoresBG() {
        let color1 = "bg-emerald-800";
        let color2 = "bg-blue-600";
        
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
            const x = (arista.destino.x + arista.origen.x) / 2;
            const y = (arista.destino.y + arista.origen.y) / 2;
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

    beforeUpdate(() => { //TODO: simplificar los ifs
        if(!prevArista) {
            prevArista = JSON.parse(JSON.stringify(arista));
            return;
        }

        //si algun peso cambia de valor redibujamos la arista
        if(prevArista.peso[0] !== arista.peso[0] || prevArista.peso[1] !== arista.peso[1]) {
            dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );
            parametros = calcularParametros();
            posicionPesos = calcularPosicionPesos();
            posicionFlujo = calcularPosicionFlujo();
            prevArista = JSON.parse(JSON.stringify(arista));
            
            return;
        }

        //si se cambia la posicion del origen o del destino recargamos la posicion de la linea
        if(prevArista.origen.x !== arista.origen.x || prevArista.origen.y !== arista.origen.y || prevArista.destino.x !== arista.destino.x || prevArista.destino.y !== arista.destino.y) {
            parametros = calcularParametros();
            posicionPesos = calcularPosicionPesos();
            posicionFlujo = calcularPosicionFlujo();

            prevArista = JSON.parse(JSON.stringify(arista));

            return;
        }

        //si cambia el estado de camino de alguno de los vertices recargamos los colores
        if(prevArista.esCamino[0] !== arista.esCamino[0] || prevArista.esCamino[1] !== arista.esCamino[1]) {
            dibujarAristaBidireccional = ( arista.peso[0] !== 0 && arista.peso[1] !== 0 );
            coloresStroke = calcularColoresStroke();
            coloresFill = calcularColoresFill();
            coloresBG = calcularColoresBG();
            prevArista = JSON.parse(JSON.stringify(arista));
            return;
        }

        prevArista = JSON.parse(JSON.stringify(arista));
        
    });



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
            posicion={{x: parametros.x2, y: parametros.y2}}
            angulo={parametros.angulo + (Math.PI / 2)}
            fillColor="{coloresFill[1]}"
        />
        <Flecha
            posicion={{x: parametros.x1, y: parametros.y1}}
            angulo={parametros.angulo - (Math.PI / 2)}
            fillColor="{coloresFill[0]}"
        />

        <Peso
            posicion={
                {
                    x: posicionPesos[0][0],
                    y: posicionPesos[0][1],
                }
            }
            peso={arista.peso[0]}
            bgColor={coloresBG[1]}
            cambiarPeso={arista.cambiarPeso}
        />
        <Peso
            posicion={
                {
                    x: posicionPesos[1][0],
                    y: posicionPesos[1][1],
                }
            }
            peso={arista.peso[1]}
            bgColor={coloresBG[0]}
            cambiarPeso={arista.cambiarPesoInverso}
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

        {#if (arista.peso[0] !== 0)}
            <Flecha
                posicion={{x: parametros.x2, y: parametros.y2}}
                angulo={parametros.angulo + (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                posicion={
                    {
                        x: posicionPesos[0][0],
                        y: posicionPesos[0][1],
                    }
                }
                peso={arista.peso[0]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={arista.cambiarPeso}
            />
        {:else}
            <Flecha
                posicion={{x: parametros.x1, y: parametros.y1}}
                angulo={parametros.angulo - (Math.PI / 2)}
                fillColor="{coloresFill[0]}"
            />
            <Peso
                posicion={
                    {
                        x: posicionPesos[1][0],
                        y: posicionPesos[1][1],
                    }
                }
                peso={arista.peso[1]}
                bgColor="{coloresBG[0]}"
                cambiarPeso={arista.cambiarPesoInverso}
            />
        {/if}
    {/if } 

        <!--Dibujamos el flujo reutilizando el componente peso-->
    {#if arista.esCamino[0]}
        <Peso
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
