import type Nodo from "./Nodo";

interface Arista {
    id: number;
    desde: Nodo;
    hasta: Nodo;
    peso: number;
    //color: string | null;
}

export default Arista;