import type Posicion from '../../interfaces/Posicion';
import type TypeVertice  from '../../interfaces/Vertice';
import type TypeArista from '../../interfaces/Arista';
import type MatrizAdyacencia from '../../interfaces/MatrizAdyacencia';

import {moverVertice, crearNuevaArista, eliminarVertice, toggleFuente, toggleSumidero} from './FuncionesGrafo';


function crearNuevoVertice(nombre: string | null ,posicionNuevoVertice: Posicion, esFuente: boolean | null, esSumidero: boolean | null,  vertices: TypeVertice[], matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], recargarVertices: Function, recargarAristas: Function, maxWith: number, maxHeight: number) {
    const nuevoVertice = {
        id: vertices.length,
        nombre: nombre,
        fuente: esFuente === null ? false : esFuente,
        sumidero: esSumidero === null ? false : esSumidero,
        x: posicionNuevoVertice.x,
        y: posicionNuevoVertice.y,
        mover: ( x: number, y: number) => moverVertice(nuevoVertice, recargarAristas , x, y, maxWith, maxHeight),
        crearArista: ( verticeY: TypeVertice, peso: number) => crearNuevaArista(nuevoVertice, verticeY, peso, matrizAdyacencia),
        eliminar: () => eliminarVertice(nuevoVertice, vertices, matrizAdyacencia),
        toggleFuente: () => toggleFuente(nuevoVertice, fuentes),
        toggleSumidero: () => toggleSumidero(nuevoVertice, sumideros),
    };

    vertices.push(nuevoVertice);
    recargarVertices();
    recargarAristas();    
}

export {
    crearNuevoVertice,
}