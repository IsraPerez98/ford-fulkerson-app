import type Nodo from "./Nodo";

interface Arista {
    desde: Nodo;
    hasta: Nodo;
    peso: number;
    pesoInverso: number;
}

export default Arista;