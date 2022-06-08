interface Nodo {
    id: number; // representa un id utilizado para identificar el nodo
    nombre: string | null; // representa el nombre del nodo, puede ser null si no se ha definido
    fuente: boolean; // representa si el nodo es una fuente
    sumidero: boolean; // representa si el nodo es un sumidero
    x: number; // representa la posicion en x del nodo
    y: number; // representa la posicion en y del nodo
}

export default Nodo;