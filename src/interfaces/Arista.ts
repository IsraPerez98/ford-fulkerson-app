import type Vertice from "./Vertice";
import type Grafo from "./Grafo";

interface Arista {
    origen: Vertice; // representa el vertice de origen de la arista
    destino: Vertice; // representa el vertice de destino de la arista
    esCamino: boolean[]; // representa si la arista es parte de un camino, el primer valor representa si es un camino de origen a destino, el segundo valor representa si es un camino de destino a origen
    peso: number[]; // representa el peso de la arista, el primer valor representa el peso desde el origen hacia el destino, el segundo valor representa el peso desde el destino hacia el origen
    flujo: number[]; // representa el flujo actual de la arista, el primer valor representa el flujo desde el origen hacia el destino, el segundo valor representa el flujo desde el destino hacia el origen

    grafo?: Grafo; // representa el grafo al que pertenece la arista

    cambiarPeso: (peso: number) => void; // funcion que cambia el peso de la arista
    cambiarPesoInverso: (peso: number) => void; // funcion que cambia el peso de la arista en sentido inverso
    destruir: () => void; // funcion que destruye la arista
}

export default Arista;