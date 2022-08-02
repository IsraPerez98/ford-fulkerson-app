interface Vertice {
    id: number; // representa un id utilizado para identificar el vetice
    nombre: string | null; // representa el nombre del vetice, puede ser null si no se ha definido
    fuente: boolean; // representa si el vetice es una fuente
    sumidero: boolean; // representa si el vetice es un sumidero
    x: number; // representa la posicion en x del vetice
    y: number; // representa la posicion en y del vetice
}

export default Vertice;