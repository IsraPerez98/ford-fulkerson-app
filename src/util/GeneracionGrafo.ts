import type Posicion from '../interfaces/Posicion';

//import type Vertice from '../../../interfaces/Vertice';
import type MatrizAdyacencia from '../interfaces/MatrizAdyacencia';
import Vertice from '../classes/Vertice';
import Arista from '../classes/Arista';
import Grafo from '../classes/Grafo';

import Consola from '../classes/Consola';

const verticeRadio = 35;

function generarArista(verticeA: number, verticeB: number, matrizAdyacencia: MatrizAdyacencia) {
    const capacidadArista = Math.floor(Math.random() * 100);

    matrizAdyacencia[verticeA][verticeB] = capacidadArista;
}

function generarMatrizAlAzar(cantVertices: number): MatrizAdyacencia {
    //generamos una matriz vacia de tamaño cantVertices x cantVertices
    const matrizAdyacencia: MatrizAdyacencia = new Array(cantVertices).fill(0).map(() => new Array(cantVertices).fill(0));

    /*
    for (let i = 0; i < cantVertices; i++) {
        const arreglo: number[] = [];
        for (let j = 0; j < cantVertices; j++) {
            if(i === j) {
                arreglo.push(0);
            } else {
                // 50% de probabilidad de que haya arista y no se generan hacia la fuente ni desde el destino
                if(Math.random() > 0.5 && j !== 0 && i !== cantVertices - 1) {
                    arreglo.push(Math.floor(Math.random() * 100));
                } else {
                    arreglo.push(0);
                }
            }
        }
        matrizAdyacencia.push(arreglo);
    }
    */
    // Generamos una lista de caminos de la fuente al destino
    let aristasRestantes = cantVertices - 1;

    while(aristasRestantes > 0) {
        //asumimos que la fuente es el vertice 0 y el destino es el vertice cantVertices - 1
        let verticeActual = 0;

        //establecemos un camino desde la fuente al destino
        while(true) {
            let siguienteVertice = Math.floor(Math.random() * (cantVertices - 1)) + 1;
            
            if(siguienteVertice === verticeActual) continue;
            
            generarArista(verticeActual, siguienteVertice, matrizAdyacencia);

            aristasRestantes--;

            if(siguienteVertice === cantVertices - 1) {
                break;
            }

            verticeActual = siguienteVertice;

        }
    }

    return matrizAdyacencia;
}

function generarPosicionesVertices(cantVertices: number, width: number, height: number): Posicion[] {
    const centro = {
        x: width / 2,
        y: height / 2
    };

    if (cantVertices === 1) {
        return [centro];
    }

    //distancia desde el centro hasta el borde del circulo
    const distancia = Math.min(width, height) / 2 - verticeRadio * 2;

    //angulo entre cada vertice
    const angulo = 2 * Math.PI / cantVertices;

    const posiciones: Posicion[] = [];

    for (let i = 0; i < cantVertices; i++) {
        const x = centro.x - distancia * Math.cos(i * angulo);
        const y = centro.y - distancia * Math.sin(i * angulo);
        posiciones.push({x, y});
    }

    //dirty hack: intercambiamos la posicion del sumidero con el vertice central del arreglo para que aparezca a la derecha
    const indiceCentral = Math.floor(cantVertices / 2);
    
    const aux = posiciones[indiceCentral];
    posiciones[indiceCentral] = posiciones[cantVertices - 1];
    posiciones[cantVertices - 1] = aux;


    return posiciones;
}

function generarVertices(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], posiciones: Posicion[]): Vertice[] {
    const vertices: Vertice[] = [];
    for (let i = 0; i < matrizAdyacencia.length; i++) {
        const nuevoVertice = new Vertice(i, fuentes[i], sumideros[i], posiciones[i]);
        vertices.push(nuevoVertice);
    }
    return vertices;
}

function asignarGrafoAVertices(vertices: Vertice[], grafo: Grafo) {
    for(const vertice of vertices) {
        vertice.asignarGrafo(grafo);
    }
}

function generarAristas(matrizAdyacencia: MatrizAdyacencia, vertices: Vertice[]): Arista[][] {
    const arregloAristas: Arista[][] = [];
    matrizAdyacencia.forEach((arreglo) => {
        arregloAristas.push(new Array(arreglo.length).fill(null));
    });

    for (let i = 0; i < matrizAdyacencia.length; i++) {
        //arregloAristas.push([]);
        for (let j = 0; j < matrizAdyacencia.length; j++) {

            if(j === i) continue;
            if(matrizAdyacencia[i][j] === 0) continue;

            const origen = vertices[i];
            const destino = vertices[j];
            const esCamino = false;
            const fueCamino = false;
            const capacidad = matrizAdyacencia[i][j];
            const flujo = 0;


            const nuevaArista = new Arista(origen, destino, esCamino, fueCamino, capacidad, flujo, null);
            //arregloAristas[i].push(nuevaArista);
            arregloAristas[i][j] = nuevaArista;
            //arregloAristas[j][i] = nuevaArista;
        }
    }

    return arregloAristas;
}

function asignarGrafoAAristas(aristas: Arista[][], grafo: Grafo) {
    for(const arreglo of aristas) {
        for(const arista of arreglo) {
            if(arista) {
                arista.asignarGrafo(grafo);
            }
        }
    }
}

function generarGrafo(matrizAdyacencia: MatrizAdyacencia, posicionesVertices: Posicion[], fuentes: boolean[], sumideros: boolean[] , width: number, height: number, recargarGrafo: Function, grafo?: Grafo) : Grafo {
    const vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, posicionesVertices);
    const aristas = generarAristas(matrizAdyacencia, vertices);
    const consola = new Consola();

    if(!grafo) {
        grafo = new Grafo(matrizAdyacencia, fuentes, sumideros, vertices, aristas, consola, width, height, recargarGrafo);
    } else {
        grafo.actualizarComponentes(matrizAdyacencia, fuentes, sumideros, vertices, aristas, width, height, recargarGrafo);
    }

    consola.asignarGrafo(grafo);
    asignarGrafoAVertices(vertices, grafo);
    asignarGrafoAAristas(aristas, grafo);

    //console.log({grafo});

    return grafo;
}

async function generarPosicionesVerticesAnimacion(grafo: Grafo): Promise<void> {
    
    const nuevasPosiciones = generarPosicionesVertices(grafo.vertices.length, grafo.width, grafo.height);


    for(const vertice of grafo.vertices) {
        const nuevaPosicion = nuevasPosiciones[vertice.id];
        vertice.moverAnimado(nuevaPosicion, 200);

        await new Promise(resolve => setTimeout(resolve, 200));
    }

}

function generarGrafoAlAzar(cantVertices: number, width: number, height: number, recargarGrafo: Function, grafo?: Grafo): Grafo {
    const matrizAdyacencia = generarMatrizAlAzar(cantVertices);

    //tomamos el primer vertice como fuente y el ultimo como sumidero
    const fuentes: boolean[] = [];
    const sumideros: boolean[] = [];
    for (let i = 0; i < cantVertices; i++) {
        fuentes.push(false);
        sumideros.push(false);
    }
    fuentes[0] = true;
    sumideros[cantVertices - 1] = true;

    //const posiciones = generarPosicionesVertices(cantVertices, width, height);
    const posiciones: Posicion[] = new Array(cantVertices).fill({x: width / 2, y: height / 2});

    const nuevoGrafo = generarGrafo(matrizAdyacencia, posiciones, fuentes, sumideros , width, height, recargarGrafo, grafo);

    generarPosicionesVerticesAnimacion(nuevoGrafo);

    return nuevoGrafo;

}

export {
    generarGrafo,
    generarGrafoAlAzar,
}