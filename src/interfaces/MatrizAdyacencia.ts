import type Grafo from "./Grafo";

interface MatrizAdyacencia extends Array<Array<number>> {
    grafo?: Grafo; // representa el grafo al que pertenece el vertice
 } //arreglo blidimensional con los pesos de las aristas


export default MatrizAdyacencia;