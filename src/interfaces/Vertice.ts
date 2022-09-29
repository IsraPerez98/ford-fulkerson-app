import type Posicion from "./Posicion";
import type Grafo from "./Grafo";

interface Vertice {
    id: number; // representa un id utilizado para identificar el vetice
    nombre: string | null; // representa el nombre del vetice, puede ser null si no se ha definido
    fuente: boolean; // representa si el vetice es una fuente
    sumidero: boolean; // representa si el vetice es un sumidero
    posicion: Posicion; // representa la posicion del vertice en el canvas
    
    grafo?: Grafo; // representa el grafo al que pertenece el vertice

    mover: (x: number, y: number) => void; // Funcion para mover el vertice
    crearArista: (verticeY: Vertice, peso: number) => void; // Funcion para crear una arista entre dos vertices
    eliminar: () => void; // Funcion para eliminar el vertice
    toggleFuente: () => void; // Funcion para cambiar el estado de fuente del vertice
    toggleSumidero: () => void; // Funcion para cambiar el estado de sumidero del vertice
}

export default Vertice;