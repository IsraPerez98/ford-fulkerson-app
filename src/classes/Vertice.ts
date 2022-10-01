import type Grafo from './Grafo';
import type Posicion from '../interfaces/Posicion';

class Vertice {
    id: number; // representa un id utilizado para identificar el vetice
    nombre: string | null; // representa el nombre del vetice, puede ser null si no se ha definido
    
    fuente: boolean; // representa si el vetice es una fuente
    sumidero: boolean; // representa si el vetice es un sumidero
    
    posicion: Posicion; // representa la posicion del vertice en el canvas

    radio: number; // representa el radio del vertice en el canvas
    
    grafo: Grafo | null; // representa el grafo al que pertenece el vertice

    mover(posicion: Posicion) : void { // mueve el vertice a la posicion indicada
        const nuevaPosicion: Posicion = {
            x: Math.max(this.radio, Math.min(this.grafo.width - (this.radio * 2), posicion.x)),
            y: Math.max(this.radio, Math.min(this.grafo.height - (this.radio), posicion.y)),
        };
        
        this.posicion = nuevaPosicion;
    
        this.grafo.recargarGrafo();
    }

    crearArista: (verticeY: Vertice, peso: number) => void; // Funcion para crear una arista entre dos vertices
    eliminar: () => void; // Funcion para eliminar el vertice
    
    toggleFuente(): void { // Funcion para cambiar el estado de fuente del vertice
        this.fuente = !this.fuente;
        this.grafo.fuentes[this.id] = this.fuente;
    }
    
    toggleSumidero(): void { // Funcion para cambiar el estado de sumidero del vertice
        this.sumidero = !this.sumidero;
        this.grafo.sumideros[this.id] = this.sumidero;
    }

    asignarGrafo(grafo: Grafo) : void { // asigna el grafo al vertice
        this.grafo = grafo;
    }

    constructor(id: number, fuente: boolean, sumidero: boolean, posicion: Posicion, nombre?: string , radio?: number, grafo?: Grafo) {
        this.id = id;
        this.nombre = nombre || null;
        this.fuente = fuente;
        this.sumidero = sumidero;
        this.posicion = posicion;

        this.radio = (radio === undefined || radio === null) ? 35 : radio;

        this.grafo = grafo || null;
    }
}

export default Vertice;
