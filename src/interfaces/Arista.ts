import type Nodo from "./Nodo";

interface Arista {
    origen: Nodo; // representa el nodo de origen de la arista
    destino: Nodo; // representa el nodo de destino de la arista
    peso: [number, number]; // representa el peso de la arista, el primer valor representa el peso desde el origen hacia el destino, el segundo valor representa el peso desde el destino hacia el origen
}

export default Arista;