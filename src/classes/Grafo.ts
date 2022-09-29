import type MatrizAdyacencia from "./MatrizAdyacencia";
import type Vertice from "./Vertice";
import type Arista from "./Arista";

class Grafo {
    matrizAdyacencia: MatrizAdyacencia; // representa la matriz de adyacencia del grafo

    fuentes: boolean[]; // representa los vertices que son fuentes
    sumideros: boolean[]; // representa los vertices que son sumiderosq

    vertices: Vertice[]; // representa los vertices del grafo
    aristas: Arista[][]; // representa las aristas del grafo

    width: number; // representa el ancho del grafo
    height: number; // representa el alto del grafo

    recargarAristas: Function; // Funcion para recargar las aristas del grafo
    recargarVertices: Function; // Funcion para recargar los vertices del grafo

    constructor(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], vertices: Vertice[], aristas: Arista[][], width: number, height: number, recargarVertices: Function, recargarAristas: Function) {
        this.matrizAdyacencia = matrizAdyacencia;
        this.fuentes = fuentes;
        this.sumideros = sumideros;
        this.vertices = vertices;
        this.aristas = aristas;
        this.width = width;
        this.height = height;
        this.recargarAristas = recargarAristas;
        this.recargarVertices = recargarVertices;
    }
}

export default Grafo;