import type MatrizAdyacencia from "./MatrizAdyacencia";
import Vertice from "./Vertice";
import Arista from "./Arista";

import type Posicion from "../interfaces/Posicion";
import type Consola from "./Consola";

import { generarGrafoAlAzar, generarGrafo } from "../components/Grafo/Funciones/GeneracionGrafo";

class Grafo {
    matrizAdyacencia: MatrizAdyacencia; // representa la matriz de adyacencia del grafo
    redResidual: number[][];

    fuentes: boolean[]; // representa los vertices que son fuentes
    sumideros: boolean[]; // representa los vertices que son sumiderosq

    vertices: Vertice[]; // representa los vertices del grafo
    aristas: Arista[][]; // representa las aristas del grafo

    consola: Consola; //Consola para mostrar mensajes del algoritmo

    width: number; // representa el ancho del grafo
    height: number; // representa el alto del grafo

    creandoArista: boolean; // representa si se esta creando una arista
    nuevaAristaVerticeOrigen: Vertice; // representa el vertice origen de la arista que se esta creando

    eliminandoVertice: boolean;

    ejecutandoFlujoMaximo: boolean; // representa si el grafo esta ejecutando el algoritmo de flujo maximo
    avanzarIteracionFlujoMaximo: boolean; // representa si el usuario presiono el boton de siguiente iteracion

    //recargarAristas: Function; // Funcion para recargar las aristas del grafo
    //recargarVertices: Function; // Funcion para recargar los vertices del grafo
    recargarGrafo: Function; // Funcion para recargar el grafo

    iniciarCreacionArista(): void {
        this.nuevaAristaVerticeOrigen = null;
        this.creandoArista = true;
        this.recargarGrafo();
    }

    seleccionarVerticeNuevaArista(vertice: Vertice): void {
        this.nuevaAristaVerticeOrigen = vertice;

        //dibujamos un vertice falso conectado por una arista al vertice seleccionado
        const verticeFalso = new Vertice(this.vertices.length, false, false, {x: vertice.posicion.x, y: vertice.posicion.y}, "", 0, this);
        this.vertices.push(verticeFalso);
        
        const arista = new Arista(verticeFalso, vertice, [false,false], [0,0], [0,0], this);
        this.aristas[vertice.id][vertice.id] = arista;

        this.recargarGrafo();

        //hacemos que el vertice falso siga al mouse
        const mousemove = (e: MouseEvent) => {
            verticeFalso.mover({ x: e.clientX, y: e.clientY });
        }
    
        window.addEventListener("mousemove", mousemove);

        let firstClick = false
        const mousedown = () => {
            
            if(!firstClick) {
                firstClick = true;
                return;
            }
            
            this.vertices.splice(this.vertices.indexOf(verticeFalso), 1);
            this.aristas[vertice.id][vertice.id] = null;
            
            
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mousedown", mousedown);
            this.finalizarCreacionArista();
        }

        document.addEventListener("mousedown", mousedown);
    }

    finalizarCreacionArista(): void {
        this.creandoArista = false;
        this.nuevaAristaVerticeOrigen = null;
        this.recargarGrafo();
    }

    iniciarEliminacionVertice(): void {
        this.eliminandoVertice = true;
        this.recargarGrafo();
    }

    eliminarVertice(vertice: Vertice): void {
        console.log({vertice});
        

        //eliminamos el vertice de los arreglos
        this.vertices.splice(vertice.id, 1);
        this.fuentes.splice(vertice.id, 1);
        this.sumideros.splice(vertice.id, 1);

        //dismunimos el id de los vertices posteriores
        for(let i = vertice.id ; i < this.vertices.length; i++) {
            this.vertices[i].id--;
        }

        //eliminamos la columna y la fila de la matriz de adyacencia
        this.matrizAdyacencia.splice(vertice.id, 1);
        for(let i = 0; i < this.matrizAdyacencia.length; i++) {
            this.matrizAdyacencia[i].splice(vertice.id, 1);
        }
        console.log(this.matrizAdyacencia);
        

        //eliminamos la columna y la fila de la matriz de aristas
        this.aristas.splice(vertice.id, 1);
        for(let i = 0; i < this.aristas.length; i++) {
            this.aristas[i].splice(vertice.id, 1);
        }
        

        this.recargarGrafo();
    }

    finalizarEliminacionVertice(): void {
        this.eliminandoVertice = false;
        this.recargarGrafo();
    }

    generarGrafoAlAzar(cantVertices: number): void {
        const grafo = generarGrafoAlAzar(cantVertices, this.width, this.height, this.recargarGrafo);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;

        this.recargarGrafo();
    }

    eliminarArista(arista: Arista): void { // funcion que elimina una arista del grafo
        this.matrizAdyacencia[arista.origen.id][arista.destino.id] = 0;
        this.matrizAdyacencia[arista.destino.id][arista.origen.id] = 0;
        this.aristas[arista.origen.id][arista.destino.id] = null;
        this.aristas[arista.destino.id][arista.origen.id] = null;
        
        this.recargarGrafo();
    }

    guardarGrafo(): void { // funcion que guarda el grafo en un archivo local
        
        //copiamos los valores de la matriz de adyacencia sin la propiedad de grafo
        const matrizAdyacencia: number[][] = [];
        for (let i = 0; i < this.matrizAdyacencia.length; i++) {
            matrizAdyacencia[i] = [];
            for (let j = 0; j < this.matrizAdyacencia[i].length; j++) {
                matrizAdyacencia[i][j] = this.matrizAdyacencia[i][j];
            }
        }

        //copiamos las posiciones de los vertices
        const posicionesVertices: Posicion[] = [];
        for (let i = 0; i < this.vertices.length; i++) {
            posicionesVertices.push(this.vertices[i].posicion);
        }

        const grafo = {
            matrizAdyacencia,
            posicionesVertices,
            fuentes: this.fuentes,
            sumideros: this.sumideros
        }

        const blob = new Blob([JSON.stringify(grafo)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = "grafo.json";
        link.href = url;
        link.click();
    }

    DFSRecursivo(verticeActual: Vertice, destino: Vertice, visitados: boolean[], camino: Vertice[]) : Vertice[] {
        visitados[verticeActual.id] = true;
        if(verticeActual === destino) {
            return [...camino, destino];
        }
    
        for(let i = 0; i < this.vertices.length; i++) {
            if(this.redResidual[verticeActual.id][i] !== 0 && !visitados[i]) {
                const caminoRecursivo = this.DFSRecursivo(this.vertices[i], destino, visitados, [...camino, verticeActual]);
    
                if(caminoRecursivo) { // si existe un camino
                    return caminoRecursivo;
                }
            }
        }
    
        return null;
    }

    buscarCamino(origen: Vertice, destino: Vertice): Vertice[] {
        //DFS
        let visitados = new Array(this.vertices.length).fill(false);
        //console.log({redResidual: this.redResidual, visitados});
    
        let camino = [];
        
        camino = this.DFSRecursivo(origen, destino, visitados, camino);
    
        return camino;
    }

    clearCaminos(): void {
        for (let i = 0; i < this.aristas.length; i++) {
            for (let j = 0; j < this.aristas.length; j++) {
                if(this.aristas[i][j]) {
                    this.aristas[i][j].esCamino = [false, false];
                    this.aristas[i][j].flujo = [0, 0];
                }
            }
        }
    }

    dibujarCamino(camino: Vertice[], flujo: number) {
        for(let i = 0; i < camino.length - 1; i++) {
            const vertice = camino[i];
            const verticeSiguiente = camino[i + 1];
    
            //console.log({vertice, verticeSiguiente});
            //console.log({arregloAristas});
    
            const arista = this.aristas[vertice.id][verticeSiguiente.id];
    
            if(arista) {
                console.log({arista});
                arista.esCamino = [true, arista.esCamino[1]];
                arista.flujo = [flujo, arista.flujo[1]];
            }
            
    
            const aristaInversa = this.aristas[verticeSiguiente.id][vertice.id];
    
            if(aristaInversa) {
                console.log({aristaInversa});
                aristaInversa.esCamino = [aristaInversa.esCamino[0], true];
                aristaInversa.flujo = [aristaInversa.flujo[0], flujo];
            }
        }
    
        this.recargarGrafo();
    }

    async esperarProximaIteracion(): Promise<void> { // funcion que espera a que el usuario presione el boton de siguiente iteracion
        this.recargarGrafo();
        console.log("Esperando siguiente iteracion");
        while(!this.avanzarIteracionFlujoMaximo) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.avanzarIteracionFlujoMaximo = false;
        this.recargarGrafo();
    }

    recargarRedResidual(): void {
        const nuevaRedResidual: number[][] = [];
        for(let i = 0; i < this.matrizAdyacencia.length; i++) {
            nuevaRedResidual.push([]);
            for(let j = 0; j < this.matrizAdyacencia.length; j++) {
                nuevaRedResidual[i].push(structuredClone(this.matrizAdyacencia[i][j]));
            }
        }
        this.redResidual = nuevaRedResidual;
    }

    async calcularFlujoMaximo(fuente: Vertice, sumidero: Vertice): Promise<void> { // funcion que ejecuta el algoritmo de flujo maximo
        let flujoMaximo = 0;
        this.recargarRedResidual();

        //printConsola("Iniciamos la variable de flujo maximo en 0");
        this.consola.printTextoExplicativo("Iniciamos la variable de flujo maximo en 0");
        //printConsola("Creamos la red residual como una copia de la matriz de adyacencia");
        this.consola.printTextoExplicativo("Creamos la red residual como una copia de la matriz de adyacencia");

        await this.esperarProximaIteracion();

        while(true) {
            //printConsola("Buscamos un camino desde la fuente al sumidero, utilizando la red residual");
            this.consola.printTextoExplicativo("Buscamos un camino desde la fuente al sumidero, utilizando la red residual");
            const camino = this.buscarCamino(fuente, sumidero);
            if(!camino) {
                //printConsola("No existe otro camino desde la fuente al sumidero, por lo tanto el flujo maximo es: " + flujoMaximo);
                this.consola.printTextoExplicativo("No existe otro camino desde la fuente al sumidero, por lo tanto el flujo maximo es: " + flujoMaximo);
                console.log({flujoMaximo});
                alert("El flujo maximo es: " + flujoMaximo);
                this.finalizarFlujoMaximo();
                return;
            }
            //printConsola("Existe un camino desde la fuente al sumidero, pasando por los vertices: " + camino.map(vertice => vertice.id).join(", "));
            this.consola.printTextoExplicativo("Existe un camino desde la fuente al sumidero, pasando por los vertices: " + camino.map(vertice => vertice.id).join(", "));
            this.dibujarCamino(camino, 0);
            await this.esperarProximaIteracion();
            
            //calculamos el cuello de botella del camino
            //printConsola("Calculamos el cuello de botella del camino, es decir el valor minimo de las aristas que lo componen");
            this.consola.printTextoExplicativo("Calculamos el cuello de botella del camino, es decir el valor minimo de las aristas que lo componen");
            let cuelloBotella = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < camino.length - 1; i++) {
                const vertice = camino[i];
                const verticeSiguiente = camino[i + 1];
                //console.log({vertice, verticeSiguiente});
                //console.log({redResidual});
                const peso = this.redResidual[vertice.id][verticeSiguiente.id];
                //console.log({peso});
                if(peso < cuelloBotella) {
                    cuelloBotella = peso;
                }
            }
            flujoMaximo += cuelloBotella;
            this.dibujarCamino(camino, cuelloBotella);

            //console.log({cuelloBotella});
            //printConsola("El cuello de botella es: " + cuelloBotella);
            //printConsola("Actualizamos el flujo maximo sumando el cuello de botella al flujo maximo actual que es: " + flujoMaximo);
            this.consola.printTextoExplicativo("El cuello de botella es: " + cuelloBotella);
            this.consola.printTextoExplicativo("Actualizamos el flujo maximo sumando el cuello de botella al flujo maximo actual que es: " + flujoMaximo);
            await this.esperarProximaIteracion();

            //actualizamos la red residual
            //printConsola("Actualizamos la red residual, restando el cuello de botella a las aristas que componen el camino");
            this.consola.printTextoExplicativo("Actualizamos la red residual, restando el cuello de botella a las aristas que componen el camino");
            for(let i = 0; i < camino.length - 1; i++) {
                const vertice = camino[i];
                const verticeSiguiente = camino[i + 1];
                this.redResidual[vertice.id][verticeSiguiente.id] -= cuelloBotella;
                //redResidual[verticeSiguiente.id - 1][vertice.id - 1] += cuelloBotella;
            }
            //TODO: Dibujar los caminos antiguos
            this.clearCaminos();

            //console.log({redResidual});
            await this.esperarProximaIteracion();
        }
    }
    
    inciarFlujoMaximo() {
        this.ejecutandoFlujoMaximo = true;
        this.avanzarIteracionFlujoMaximo = false;

        const fuentes = this.vertices.filter(vertice => vertice.fuente);
        const sumideros = this.vertices.filter(vertice => vertice.sumidero);

        if(fuentes.length === 0) {
            alert("Debe haber al menos una fuente");
            this.finalizarFlujoMaximo();
            return;
        }

        if(sumideros.length === 0) {
            alert("Debe haber al menos un sumidero");
            this.finalizarFlujoMaximo();
            return;
        }

        if(fuentes.length > 1 || sumideros.length > 1) {
            //TODO: EJECTUAR ALGORITMO DE FLUJO MAXIMO CON FUENTES Y SUMIDEROS MULTIPLES
            alert("Solo puede haber una fuente y un sumidero");
            this.finalizarFlujoMaximo();
            return;
        }

        const fuente = fuentes[0];
        const sumidero = sumideros[0];
        this.calcularFlujoMaximo(fuente, sumidero);
    }

    continuarFlujoMaximo() {
        this.avanzarIteracionFlujoMaximo = true;
    }

    finalizarFlujoMaximo() {
        this.ejecutandoFlujoMaximo = false;
        this.avanzarIteracionFlujoMaximo = false;
        this.clearCaminos();
        this.recargarGrafo();
    }
    
    generarGrafo(matrizAdyacencia: MatrizAdyacencia, posicionesVertices: Posicion[], fuentes: boolean[], sumideros: boolean[]): void { // funcion que genera un grafo a partir de parametros
        const grafo: Grafo = generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros , this.width, this.height, this.recargarGrafo);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;
        this.ejecutandoFlujoMaximo = false;
        
        this.recargarGrafo();
    }

    crearNuevoVertice(fuente: boolean, sumidero: boolean, posicion: Posicion, nombre?: string, radio?: number): void {
        const nuevoVertice = new Vertice(this.vertices.length, fuente, sumidero, posicion, nombre, radio, this);
        this.vertices.push(nuevoVertice);
        
        this.fuentes.push(fuente);
        this.sumideros.push(sumidero);

        //generamos una nueva fila y columna en la matriz de adyacencia
        this.matrizAdyacencia.push(Array(this.vertices.length).fill(0));
        for(let i = 0; i < this.matrizAdyacencia.length; i++) {
            this.matrizAdyacencia[i].push(0);
        }

        //generamos una nueva fila y columna en la matriz de aristas
        this.aristas.push(Array(this.vertices.length).fill(null));
        for(let i = 0; i < this.aristas.length; i++) {
            this.aristas[i].push(null);
        }

        this.recargarGrafo();
        
    }

    crearNuevaArista(verticeOrigen: Vertice, verticeDestino: Vertice, peso: number): void {
        //console.log({verticeOrigen, verticeDestino, peso});
        //Si la matriz ya existe y es bidireccional, entonces no se puede crear una nueva
        if(this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] !== 0 && this.matrizAdyacencia[verticeDestino.id][verticeOrigen.id] !== 0) {
            alert("Ya existe esta arista");
            this.finalizarCreacionArista();
            return;
        }

        //Si la arista ya existe pero no es bidireccional, la hacemos bidireccional
        if(this.aristas[verticeOrigen.id][verticeDestino.id] || this.aristas[verticeDestino.id][verticeOrigen.id]) {
            const aristaExistente = this.aristas[verticeOrigen.id][verticeDestino.id] || this.aristas[verticeDestino.id][verticeOrigen.id];
            
            //debemos comprobar si la arista es inversa
            if(aristaExistente.origen === verticeOrigen) {
                if(this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] !== 0) {
                    alert("Ya existe esta arista");
                    this.finalizarCreacionArista();
                    return;
                }

                //Modificamos la arista
                aristaExistente.peso = [peso, aristaExistente.peso[1]];
                this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] = peso;
                
                this.finalizarCreacionArista();
                return;
            
            } else { //Arista inversa
                
                if(this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] !== 0) {
                    alert("Ya existe esta arista");
                    this.finalizarCreacionArista();
                    return;
                }

                //Modificamos la arista
                aristaExistente.peso = [aristaExistente.peso[0], peso];
                this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] = peso;
                
                this.finalizarCreacionArista();
                return;

            }
        }
        
        //Creamos la arista
        const nuevaArista = new Arista(verticeOrigen, verticeDestino, [false, false], [peso, 0], [0,0], this);
        this.aristas[verticeOrigen.id][verticeDestino.id] = nuevaArista;
        this.matrizAdyacencia[verticeOrigen.id][verticeDestino.id] = peso;
        this.finalizarCreacionArista();
    }

    constructor(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], vertices: Vertice[], aristas: Arista[][], consola: Consola, width: number, height: number, recargarGrafo: Function) {
        this.matrizAdyacencia = matrizAdyacencia;
        this.fuentes = fuentes;
        this.sumideros = sumideros;
        this.vertices = vertices;
        this.aristas = aristas;
        this.width = width;
        this.height = height;

        this.consola = consola;
        
        //this.recargarAristas = recargarAristas;
        //this.recargarVertices = recargarVertices;
        this.recargarGrafo = recargarGrafo;
        
        this.ejecutandoFlujoMaximo = false;
        this.avanzarIteracionFlujoMaximo = false;
    }
}

export default Grafo;