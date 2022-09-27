import type Posicion from '../../../interfaces/Posicion';
import type TypeVertice  from '../../../interfaces/Vertice';
import type TypeArista from '../../../interfaces/Arista';
import type MatrizAdyacencia from '../../../interfaces/MatrizAdyacencia';

const verticeRadio = 35;

import {crearNuevaArista} from './ModificacionAristas';

function crearVerticeDinamico(creandoVertice: boolean, vertices: TypeVertice[], matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], recargarVertices: Function, recargarAristas: Function, maxWith: number, maxHeight: number) {
    if(creandoVertice) {
        alert("Ya se está creando un vertice");
        console.log("Ya se está creando un vertice");
        return;
    }
    if(!creandoVertice) {
        creandoVertice = true;
    }

    console.log("Creando vertice");
    
    //dibujamos un vertice que se va a mover hasta que se de click en el canvas
    //cuando se de click en el canvas se crea el vertice en la posicion del mouse

    const nuevoVertice = {
        id: vertices.length,
        nombre: null,
        fuente: false,
        sumidero: false,
        x: maxWith / 2,
        y: maxHeight / 2,
        mover: ( x: number, y: number) => moverVertice(nuevoVertice, recargarAristas , x, y, maxWith, maxHeight),
        crearArista: ( verticeY: TypeVertice, peso: number) => crearNuevaArista(nuevoVertice, verticeY, peso, matrizAdyacencia),
        eliminar: () => eliminarVertice(nuevoVertice, vertices, matrizAdyacencia),
        toggleFuente: () => toggleFuente(nuevoVertice, fuentes),
        toggleSumidero: () => toggleSumidero(nuevoVertice, sumideros),
    };

    vertices.push(nuevoVertice);
    recargarVertices();

    //hacemos que el nuevoVertice siga al mouse
    function mouseMove(event: MouseEvent) {
        nuevoVertice.mover(event.clientX, event.clientY);
        recargarVertices();
    }
    document.addEventListener('mousemove', mouseMove);

    //debemos esperar al segundo click, ya que javascript registra el  click del boton
    //TODO: Encontrar una forma mejor de no considerar el click del boton
    let clickedOnce = false;

    //cuando se de click en el canvas se crea el vertice
    function mouseClick(event: MouseEvent) {
        if(!clickedOnce) {
            clickedOnce = true;
            return;
        }

        //eliminamos el evento move
        document.removeEventListener('mousemove', mouseMove);
        //eliminamos el evento click
        document.removeEventListener('click', mouseClick);
        //terminamos la creacion del vertice
        creandoVertice = false;
    }
    
    document.addEventListener('click', mouseClick);

}

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

function toggleFuente(vertice: TypeVertice, fuentes: boolean[]) {
    if(vertice.sumidero) {
        alert("No se puede hacer un vertice fuente y sumidero a la vez");
        return;
    }
    vertice.fuente = !vertice.fuente;
    fuentes[vertice.id] = vertice.fuente;
}

function toggleSumidero(vertice: TypeVertice, sumideros: boolean[]) {
    if(vertice.fuente) {
        alert("No se puede hacer un vertice fuente y sumidero a la vez");
        return;
    }
    vertice.sumidero = !vertice.sumidero;
    sumideros[vertice.id] = vertice.sumidero;
}

function eliminarVertice(vertice: TypeVertice, arregloVertices: TypeVertice[], matrizAdyacencia: MatrizAdyacencia) {
    const { id } = vertice;
    //restamos 1 al id de los vertices que sean mayores al eliminado
    arregloVertices.forEach((vertice) => {
        if (vertice.id > id) {
            vertice.id -= 1;
        }
    });

    //eliminamos el vertice del arreglo de vertices
    arregloVertices.splice(id - 1, 1);

    //eliminamos el vertice de la matriz de adyacencia
    matrizAdyacencia.splice(id - 1, 1);
    matrizAdyacencia.forEach((arreglo) => {
        arreglo.splice(id - 1, 1);
    });
}

function moverVertice(vertice: TypeVertice, recargarAristas: Function, posX: number, posY: number, maxWith: number, maxHeight: number) {
    posX = Math.max(verticeRadio, Math.min(maxWith - (verticeRadio * 2), posX));
    posY = Math.max(verticeRadio, Math.min(maxHeight - verticeRadio , posY));
    
    vertice.x = posX;
    vertice.y = posY;

    recargarAristas();
}


export {
    crearVerticeDinamico,
    crearNuevoVertice,
    toggleFuente,
    toggleSumidero,
    eliminarVertice,
    moverVertice,
}