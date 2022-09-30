import type MatrizAdyacencia from "./MatrizAdyacencia";
import type Vertice from "./Vertice";
import type Arista from "./Arista";

import type Posicion from "../interfaces/Posicion";

import { generarGrafoAlAzar, generarGrafo } from "../components/Grafo/Funciones/GeneracionGrafo";

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

    generarGrafoAlAzar(cantVertices: number): void {
        const grafo = generarGrafoAlAzar(cantVertices, this.width, this.height, this.recargarVertices, this.recargarAristas);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;

        this.recargarAristas();
        this.recargarVertices();
    }

    eliminarArista(arista: Arista): void { // funcion que elimina una arista del grafo
        this.matrizAdyacencia[arista.origen.id][arista.destino.id] = 0;
        this.matrizAdyacencia[arista.destino.id][arista.origen.id] = 0;
        this.aristas[arista.origen.id][arista.destino.id] = null;
        this.aristas[arista.destino.id][arista.origen.id] = null;
        this.recargarAristas();
    }

    guardarGrafo(): void { // funcion que guarda el grafo en un archivo local
        
        //copiamos los valores de la matriz de adyacencia sin la propiedad de grafo
        const matrizAdyacencia: number[][] = [];
        for (let i = 0; i < this.matrizAdyacencia.length; i++) {
            matrizAdyacencia[i] = [];
            for (let j = 0; j < this.matrizAdyacencia[i].length; j++) {
                matrizAdyacencia[i][j] = this.matrizAdyacencia[i][j];
            }
        }

        //copiamos las posiciones de los vertices
        const posicionesVertices: Posicion[] = [];
        for (let i = 0; i < this.vertices.length; i++) {
            posicionesVertices.push(this.vertices[i].posicion);
        }

        const grafo = {
            matrizAdyacencia,
            posicionesVertices,
            fuentes: this.fuentes,
            sumideros: this.sumideros
        }

        const blob = new Blob([JSON.stringify(grafo)], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = "grafo.json";
        link.href = url;
        link.click();
    }

    
    generarGrafo(matrizAdyacencia: MatrizAdyacencia, posicionesVertices: Posicion[], fuentes: boolean[], sumideros: boolean[]): void { // funcion que genera un grafo a partir de parametros
        const grafo: Grafo = generarGrafo(matrizAdyacencia, posicionesVertices, fuentes, sumideros , this.width, this.height, this.recargarVertices, this.recargarAristas);
        
        this.matrizAdyacencia = grafo.matrizAdyacencia;
        this.fuentes = grafo.fuentes;
        this.sumideros = grafo.sumideros;
        this.vertices = grafo.vertices;
        this.aristas = grafo.aristas;
        
        this.recargarAristas();
        this.recargarVertices();
    }
    

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