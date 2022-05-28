import type Nodo from "./Nodo";

interface Arista {
    desde: Nodo;
    hasta: Nodo;
    peso: number;
}

export default Arista;