import type Grafo from "./Grafo";

class Consola {
    textoExplicativo: string[];
    grafo: Grafo | null;

    printTextoExplicativo(texto: string) {
        this.textoExplicativo.push(texto);
        if(this.textoExplicativo.length > 1000) {
            this.textoExplicativo.shift();
        }

        this.grafo.recargarGrafo();
    }

    asignarGrafo(grafo: Grafo) {
        this.grafo = grafo;
    }

    constructor(grafo?: Grafo) {
        this.textoExplicativo = [];
        this.grafo = grafo || null;
    }
}

export default Consola;