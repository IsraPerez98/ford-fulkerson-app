import type Vertice from "./Vertice";
import type Grafo from "./Grafo";

class Arista {
    public origen: Vertice; // representa el vertice de origen de la arista
    public destino: Vertice; // representa el vertice de destino de la arista
    public esCamino: boolean; // representa si la arista es parte de un camino
    public peso: number; // representa el peso de la arista
    public flujo: number; // representa el flujo actual de la arista

    public grafo: Grafo | null; // representa el grafo al que pertenece la arista

    
    public cambiarPeso(peso: number): void{ // funcion que cambia el peso de la arista
        this.peso = peso;
        this.grafo.matrizAdyacencia[this.origen.id][this.destino.id] = peso;
        this.grafo.recargarGrafo();

        if(this.peso === 0){
            this.grafo.eliminarArista(this);
        }
    }

    public asignarGrafo(grafo: Grafo) : void { // asigna el grafo a la arista
        this.grafo = grafo;
    }

    public eliminar(): void { // elimina la arista del grafo
        this.grafo.eliminarArista(this);
    }

    constructor(origen: Vertice, destino: Vertice, esCamino: boolean, peso: number, flujo: number, grafo: Grafo | null) {
        this.origen = origen;
        this.destino = destino;
        this.esCamino = esCamino;
        this.peso = peso;
        this.flujo = flujo;

        this.grafo = grafo;
    }
}

export default Arista;