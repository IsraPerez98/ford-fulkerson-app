import type Vertice from "./Vertice";
import type Grafo from "./Grafo";

class Arista {
    origen: Vertice; // representa el vertice de origen de la arista
    destino: Vertice; // representa el vertice de destino de la arista
    esCamino: boolean[]; // representa si la arista es parte de un camino, el primer valor representa si es un camino de origen a destino, el segundo valor representa si es un camino de destino a origen
    peso: number[]; // representa el peso de la arista, el primer valor representa el peso desde el origen hacia el destino, el segundo valor representa el peso desde el destino hacia el origen
    flujo: number[]; // representa el flujo actual de la arista, el primer valor representa el flujo desde el origen hacia el destino, el segundo valor representa el flujo desde el destino hacia el origen

    grafo: Grafo | null; // representa el grafo al que pertenece la arista

    cambiarPeso(peso: number): void{ // funcion que cambia el peso de la arista
        this.peso[0] = peso;
        this.grafo.matrizAdyacencia[this.origen.id][this.destino.id] = peso;
        this.grafo.recargarAristas();

        if(this.peso[0] === 0 && this.peso[1] === 0){
            this.grafo.eliminarArista(this);
        }
    }
    
    cambiarPesoInverso(peso: number): void{ // funcion que cambia el peso de la arista en sentido inverso
        this.peso[1] = peso;
        this.grafo.matrizAdyacencia[this.destino.id][this.origen.id] = peso;
        this.grafo.recargarAristas();
        if(this.peso[0] === 0 && this.peso[1] === 0){
            this.grafo.eliminarArista(this);
        }
    }

    destruir: () => void; // funcion que destruye la arista

    asignarGrafo(grafo: Grafo) : void { // asigna el grafo a la arista
        this.grafo = grafo;
    }

    constructor(origen: Vertice, destino: Vertice, esCamino: boolean[], peso: number[], flujo: number[], grafo: Grafo | null) {
        this.origen = origen;
        this.destino = destino;
        this.esCamino = esCamino;
        this.peso = peso;
        this.flujo = flujo;

        this.grafo = grafo;
    }
}

export default Arista;