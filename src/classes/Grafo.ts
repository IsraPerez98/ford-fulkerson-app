import type MatrizAdyacencia from "../interfaces/MatrizAdyacencia";
import Vertice from "./Vertice";
import Arista from "./Arista";

import type Posicion from "../interfaces/Posicion";
import type Consola from "./Consola";

import { generarGrafoAlAzar, generarGrafo } from "../components/Grafo/Funciones/GeneracionGrafo";

function cancelarConClick(callback: Function) {
    const mousedown = (e: MouseEvent) => {
        callback();
        document.removeEventListener("mousedown", mousedown);
    };
    document.addEventListener("mousedown", mousedown);
}

class Grafo {
    public matrizAdyacencia: MatrizAdyacencia; // representa la matriz de adyacencia del grafo
    public redResidual: number[][];

    public fuentes: boolean[]; // representa los vertices que son fuentes
    public sumideros: boolean[]; // representa los vertices que son sumiderosq

    public vertices: Vertice[]; // representa los vertices del grafo
    public aristas: Arista[][]; // representa las aristas del grafo

    public consola: Consola; //Consola para mostrar mensajes del algoritmo

    public width: number; // representa el ancho del grafo
    public height: number; // representa el alto del grafo

    public creandoVertice: boolean; // representa si se esta creando un vertice

    public creandoArista: boolean; // representa si se esta creando una arista
    public nuevaAristaVerticeOrigen: Vertice; // representa el vertice origen de la arista que se esta creando

    public eliminandoVertice: boolean; //representa si se esta eliminando un vertice

    public eliminandoArista: boolean; //representa si se esta eliminando una arista

    public ejecutandoFlujoMaximo: boolean; // representa si el grafo esta ejecutando el algoritmo de flujo maximo
    private avanzarIteracionFlujoMaximo: boolean; // representa si el usuario presiono el boton de siguiente iteracion

    public recargarGrafo: Function; // Funcion para recargar el grafo con svelte

    public iniciarCreacionVertice(): void {
        this.creandoVertice = true;
        this.recargarGrafo();

    }

    private crearVerticeDinamico(): void {
        const centro: Posicion = {
            x: this.width / 2,
            y: this.height / 2,
        };
        const nuevoVertice = new Vertice(this.vertices.length, false, false, centro, "Nuevo Vertice", null, this);
    
        //lo metemos al grafo para que sea renderizado
        this.vertices.push(nuevoVertice);
        this.recargarGrafo();
    
        //hacemos que el nuevo grafo siga al mouse
        const mousemove = (e: MouseEvent) => {
            nuevoVertice.mover({ x: e.clientX, y: e.clientY });
        }
    
        window.addEventListener("mousemove", mousemove);
    
        //cuando se haga click, se crea el vertice
        const mousedown = (e: MouseEvent) => {
            //eliminamos el vertice falso
            this.vertices.splice(this.vertices.indexOf(nuevoVertice), 1);
    
            //creamos el vertice real
            this.crearNuevoVertice(false, false, { x: e.clientX, y: e.clientY }, null, null);

            this.finalizarCreacionVertice();
    
            //quitamos los listeners
            window.removeEventListener("mousemove", mousemove);
            window.removeEventListener("mouseup", mousedown);
        }
    
        window.addEventListener("mouseup", mousedown);
    }

    public finalizarCreacionVertice(): void {
        this.creandoVertice = false;
        this.recargarGrafo();
    }

    public iniciarEliminacionArista(): void {
        this.eliminandoArista = true;
        this.recargarGrafo();
        const mousedown = async (e: MouseEvent) => {
            //esperamos 100ms para que el evento de click del vertice se ejecute
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.finalizarEliminacionArista();
            document.removeEventListener("mousedown", mousedown);
        };
        document.addEventListener("mousedown", mousedown);
        //cancelarConClick(this.finalizarEliminacionArista.bind(this));
    }

    public finalizarEliminacionArista(): void {
        this.eliminandoArista = false;
        this.recargarGrafo();
    }

    public iniciarCreacionArista(): void {
        this.nuevaAristaVerticeOrigen = null;
        this.creandoArista = true;
        this.recargarGrafo();
        //cancelarConClick(this.finalizarCreacionArista.bind(this));
        const mousedown = (e: MouseEvent) => {
            if(!this.nuevaAristaVerticeOrigen) {
                this.finalizarCreacionArista();
                document.removeEventListener("mousedown", mousedown);
            }
        };
        document.addEventListener("mousedown", mousedown);
    }

    public seleccionarVerticeNuevaArista(vertice: Vertice): void {
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

    public finalizarCreacionArista(): void {
        this.creandoArista = false;
        this.nuevaAristaVerticeOrigen = null;
        this.recargarGrafo();
    }

    public iniciarEliminacionVertice(): void {
        this.eliminandoVertice = true;
        this.recargarGrafo();
        cancelarConClick(this.finalizarEliminacionVertice.bind(this));
    }

    public eliminarVertice(vertice: Vertice): void {
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

    public finalizarEliminacionVertice(): void {
        this.eliminandoVertice = false;
        this.recargarGrafo();
    }

    public generarGrafoAlAzar(cantVertices: number): void {
        const grafo = generarGrafoAlAzar(cantVertices, this.width, this.height, this.recargarGrafo);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;

        this.recargarGrafo();
    }

    public eliminarArista(arista: Arista): void { // funcion que elimina una arista del grafo
        this.matrizAdyacencia[arista.origen.id][arista.destino.id] = 0;
        this.matrizAdyacencia[arista.destino.id][arista.origen.id] = 0;
        this.aristas[arista.origen.id][arista.destino.id] = null;
        this.aristas[arista.destino.id][arista.origen.id] = null;
        
        this.recargarGrafo();
    }

    public guardarGrafo(): void { // funcion que guarda el grafo en un archivo local
        
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
    
    public inciarFlujoMaximo() {
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

    public continuarFlujoMaximo() {
        this.avanzarIteracionFlujoMaximo = true;
    }

    public finalizarFlujoMaximo() {
        this.ejecutandoFlujoMaximo = false;
        this.avanzarIteracionFlujoMaximo = false;
        this.clearCaminos();
        this.recargarGrafo();
    }
    
    public generarGrafo(matrizAdyacencia: MatrizAdyacencia, posicionesVertices: Posicion[], fuentes: boolean[], sumideros: boolean[]): void { // funcion que genera un grafo a partir de parametros
        const grafo: Grafo = generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros , this.width, this.height, this.recargarGrafo);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;
        this.ejecutandoFlujoMaximo = false;
        
        this.recargarGrafo();
    }

    public crearNuevoVertice(fuente: boolean, sumidero: boolean, posicion: Posicion, nombre?: string, radio?: number): void {
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

    public crearNuevaArista(verticeOrigen: Vertice, verticeDestino: Vertice, peso: number): void {
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

    private DFSRecursivo(verticeActual: Vertice, destino: Vertice, visitados: boolean[], camino: Vertice[]) : Vertice[] {
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

    private buscarCamino(origen: Vertice, destino: Vertice): Vertice[] {
        //DFS
        let visitados = new Array(this.vertices.length).fill(false);
        //console.log({redResidual: this.redResidual, visitados});
    
        let camino = [];
        
        camino = this.DFSRecursivo(origen, destino, visitados, camino);
    
        return camino;
    }

    private clearCaminos(): void {
        for (let i = 0; i < this.aristas.length; i++) {
            for (let j = 0; j < this.aristas.length; j++) {
                if(this.aristas[i][j]) {
                    this.aristas[i][j].esCamino = [false, false];
                    this.aristas[i][j].flujo = [0, 0];
                }
            }
        }
    }

    private dibujarCamino(camino: Vertice[], flujo: number) {
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

    private async esperarProximaIteracion(): Promise<void> { // funcion que espera a que el usuario presione el boton de siguiente iteracion
        this.recargarGrafo();
        console.log("Esperando siguiente iteracion");
        while(!this.avanzarIteracionFlujoMaximo) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.avanzarIteracionFlujoMaximo = false;
        this.recargarGrafo();
    }

    private recargarRedResidual(): void {
        const nuevaRedResidual: number[][] = [];
        for(let i = 0; i < this.matrizAdyacencia.length; i++) {
            nuevaRedResidual.push([]);
            for(let j = 0; j < this.matrizAdyacencia.length; j++) {
                nuevaRedResidual[i].push(structuredClone(this.matrizAdyacencia[i][j]));
            }
        }
        this.redResidual = nuevaRedResidual;
    }

    private async calcularFlujoMaximo(fuente: Vertice, sumidero: Vertice): Promise<void> { // funcion que ejecuta el algoritmo de flujo maximo
        
        this.recargarRedResidual(); // <-- Hacemos esto aca para evitar problemas al mostrar la variable en consola

        this.consola.printTextoExplicativo("✨ Iniciamos la variable de flujo maximo en 0");
        this.consola.setUbicacionPseudoCodigo("DEFINIR FLUJO_MAXIMO = 0");

        let flujoMaximo = 0;

        await this.esperarProximaIteracion();
        
        this.consola.printTextoExplicativo("🕸️ Creamos la red residual como una copia de la matriz de adyacencia");
        this.consola.setUbicacionPseudoCodigo("DEFINIR RED_RESIDUAL = MATRIZ_ADYACENCIA");

        //this.recargarRedResidual();

        await this.esperarProximaIteracion();

        this.consola.printTextoExplicativo("🔍️ Buscamos un camino desde la fuente al sumidero, utilizando la red residual");
        this.consola.setUbicacionPseudoCodigo("CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)");

        let camino = this.buscarCamino(fuente, sumidero);
        
        await this.esperarProximaIteracion();

        while(true) {
            
            if(!camino) {
                
                this.consola.printTextoExplicativo("🚫 No existe otro camino desde la fuente al sumidero, por lo tanto finalizamos el algoritmo");
                this.consola.setUbicacionPseudoCodigo("FIN_MIENTRAS");
                await this.esperarProximaIteracion();
                
                this.consola.printTextoExplicativo("🎉 El flujo maximo es: " + flujoMaximo);
                this.consola.setUbicacionPseudoCodigo("RETORNAR FLUJO_MAXIMO");
                await this.esperarProximaIteracion();

                this.finalizarFlujoMaximo();
                return;
            }
            
            this.consola.printTextoExplicativo("🗺️ Existe un camino desde la fuente al sumidero, pasando por los vertices: " + camino.map(vertice => vertice.id).join(", "));
            this.consola.setUbicacionPseudoCodigo("MIENTRAS EXISTA CAMINO:");
            this.dibujarCamino(camino, 0);
            await this.esperarProximaIteracion();
            
            this.consola.printTextoExplicativo("📈 Calculamos el flujo que puede pasar por el camino");
            this.consola.printTextoExplicativo("📈 El flujo que puede pasar por el camino es el minimo entre las aristas que lo componen");
            this.consola.setUbicacionPseudoCodigo("    FLUJO_MINIMO = MINIMO(CAPACIDADES(CAMINO))");
            
            let cuelloBotella = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < camino.length - 1; i++) {
                const vertice = camino[i];
                const verticeSiguiente = camino[i + 1];

                const peso = this.redResidual[vertice.id][verticeSiguiente.id];

                if(peso < cuelloBotella) {
                    cuelloBotella = peso;
                }
            }
            this.consola.printTextoExplicativo("🚰 El flujo minimo del camino es: " + cuelloBotella);

            await this.esperarProximaIteracion();

            this.consola.printTextoExplicativo("➕ Sumamos el flujo minimo al flujo maximo");
            this.consola.setUbicacionPseudoCodigo("    FLUJO_MAXIMO = FLUJO_MAXIMO + FLUJO_MINIMO");
            
            flujoMaximo += cuelloBotella;
            this.dibujarCamino(camino, cuelloBotella);
            this.consola.printTextoExplicativo("🚰 El flujo maximo actualmente es: " + flujoMaximo);

            await this.esperarProximaIteracion();

            this.consola.printTextoExplicativo("🕸️ Actualizamos la red residual");
            this.consola.printTextoExplicativo("🕸️ Restamos el flujo minimo a las aristas que componen el camino");
            this.consola.printTextoExplicativo("🤔 ¿Por que restamos el flujo minimo a las aristas que componen el camino?");
            this.consola.printTextoExplicativo("🤔 Porque de esta forma estamos indicando que el flujo minimo ya pasó por esas aristas");
            this.consola.setUbicacionPseudoCodigo("    ACTUALIZAR_CAPACIDADES(RED_RESIDUAL ,CAMINO, FLUJO_MINIMO)")
            
            for(let i = 0; i < camino.length - 1; i++) {
                const vertice = camino[i];
                const verticeSiguiente = camino[i + 1];
                this.redResidual[vertice.id][verticeSiguiente.id] -= cuelloBotella;
            }
            //TODO: Dibujar los caminos antiguos
            this.clearCaminos();

            await this.esperarProximaIteracion();

            this.consola.printTextoExplicativo("🔍️ Buscamos un nuevo camino desde la fuente al sumidero, utilizando la red residual");
            this.consola.setUbicacionPseudoCodigo("    CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)");
            
            camino = this.buscarCamino(fuente, sumidero);

            await this.esperarProximaIteracion();
        }
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