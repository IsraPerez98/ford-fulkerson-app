import type Vertice from "./Vertice";

interface Arista {
    origen: Vertice; // representa el vertice de origen de la arista
    destino: Vertice; // representa el vertice de destino de la arista
    peso: [number, number]; // representa el peso de la arista, el primer valor representa el peso desde el origen hacia el destino, el segundo valor representa el peso desde el destino hacia el origen
}

export default Arista;