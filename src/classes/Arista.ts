import type Vertice from "./Vertice";
import type Grafo from "./Grafo";

class Arista {
    public origen: Vertice; // representa el vertice de origen de la arista
    public destino: Vertice; // representa el vertice de destino de la arista
    public esCamino: boolean; // representa si la arista es parte de un camino
    public fueCamino: boolean; // representa si la arista fue parte de un camino en iteraciones previas
    public capacidad: number; // representa la capacidad de la arista
    public flujo: number; // representa el flujo actual de la arista

    public grafo: Grafo | null; // representa el grafo al que pertenece la arista

    
    public cambiarCapacidad(capacidadNueva: number): number{ // funcion que cambia la capacidad de la arista
        //si se esta ejecutando el algoritmo no se puede cambiar la capacidad
        if(this.grafo?.ejecutandoFlujoMaximo) {
            alert("No se puede cambiar la capacidad de una arista mientras se esta ejecutando el algoritmo");
            return this.capacidad;
        }

        this.capacidad = capacidadNueva;
        this.grafo.matrizAdyacencia[this.origen.id][this.destino.id] = capacidadNueva;

        if(this.capacidad === 0){
            this.grafo.eliminarArista(this);
        }

        this.grafo.finalizarModificacionGrafo();

        return this.capacidad;
    }

    public asignarGrafo(grafo: Grafo) : void { // asigna el grafo a la arista
        this.grafo = grafo;
    }

    public eliminar(): void { // elimina la arista del grafo
        this.grafo.eliminarArista(this);
    }

    constructor(origen: Vertice, destino: Vertice, esCamino: boolean, fueCamino: boolean, capacidad: number, flujo: number, grafo: Grafo | null) {
        this.origen = origen;
        this.destino = destino;
        this.esCamino = esCamino;
        this.fueCamino = fueCamino;
        this.capacidad = capacidad;
        this.flujo = flujo;

        this.grafo = grafo;
    }
}

export default Arista;