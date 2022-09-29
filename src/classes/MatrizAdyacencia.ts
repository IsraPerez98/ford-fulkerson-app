import type Grafo from "./Grafo";

class MatrizAdyacencia extends Array<Array<number>> { //arreglo blidimensional con los pesos de las aristas
    grafo: Grafo | null; // representa el grafo al que pertenece el vertice

    asignarGrafo(grafo: Grafo) : void { // asigna el grafo a la matriz de adyacencia
        this.grafo = grafo;
    }

    constructor() {
        super();
    }

 } 


export default MatrizAdyacencia;