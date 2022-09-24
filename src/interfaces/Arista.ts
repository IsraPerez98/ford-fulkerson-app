import type Vertice from "./Vertice";

interface Arista {
    origen: Vertice; // representa el vertice de origen de la arista
    destino: Vertice; // representa el vertice de destino de la arista
    esCamino: boolean[]; // representa si la arista es parte de un camino, el primer valor representa si es un camino de origen a destino, el segundo valor representa si es un camino de destino a origen
    peso: number[]; // representa el peso de la arista, el primer valor representa el peso desde el origen hacia el destino, el segundo valor representa el peso desde el destino hacia el origen
    flujo: number[]; // representa el flujo actual de la arista, el primer valor representa el flujo desde el origen hacia el destino, el segundo valor representa el flujo desde el destino hacia el origen

    cambiarPeso: (peso: number) => void; // funcion que cambia el peso de la arista
    cambiarPesoInverso: (peso: number) => void; // funcion que cambia el peso de la arista en sentido inverso
    destruir: () => void; // funcion que destruye la arista
}

export default Arista;