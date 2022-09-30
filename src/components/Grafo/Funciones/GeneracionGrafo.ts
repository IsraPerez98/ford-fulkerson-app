import type Posicion from '../../../interfaces/Posicion';

//import type Vertice from '../../../interfaces/Vertice';
import MatrizAdyacencia from '../../../classes/MatrizAdyacencia';
import Vertice from '../../../classes/Vertice';
import Arista from '../../../classes/Arista';
import Grafo from '../../../classes/Grafo';

const verticeRadio = 35;

function generarMatrizAlAzar(cantVertices: number): MatrizAdyacencia {
    const matrizAdyacencia = new MatrizAdyacencia();

    for (let i = 0; i < cantVertices; i++) {
        const arreglo: number[] = [];
        for (let j = 0; j < cantVertices; j++) {
            if(i === j) {
                arreglo.push(0);
            } else {
                if(Math.random() > 0.5) {
                    arreglo.push(Math.floor(Math.random() * 100));
                } else {
                    arreglo.push(0);
                }
            }
        }
        matrizAdyacencia.push(arreglo);
    }
    //console.log({matrizAdyacencia});
    return matrizAdyacencia;
}

function generarPosicionesVerticesw(cantVertices: number, width: number, height: number): Posicion[] {
    const extra = 2;

    const x_min = verticeRadio;
    const x_max = width - (verticeRadio * 2);
    const y_min = verticeRadio;
    const y_max = height - verticeRadio;

    const cantDivisiones = cantVertices * extra;
    const divisiones = Math.sqrt(cantDivisiones);
    const divisiones_x = Math.round(divisiones);
    const divisiones_y = Math.ceil(divisiones);

    //console.log({divisiones_x, divisiones_y});

    const x_div = Math.floor((x_max - x_min) / divisiones_x);
    const y_div = Math.floor((y_max - y_min) / divisiones_y);


    const x_mid_offset = Math.floor(x_div / 2);
    const y_mid_offset = Math.floor(y_div / 2);

    //construimos una matriz con las posiciones de los vertices
    const matrizPosiciones: {x: number, y: number}[][] = [];
    for (let i = 0; i < divisiones_x; i++) {
        matrizPosiciones.push([]);
        for (let j = 0; j < divisiones_y; j++) {
            matrizPosiciones[i].push({
                x: x_min + (i * x_div) + x_mid_offset,
                y: y_min + (j * y_div) + y_mid_offset,
            });
        }
    }

    //colocamos cada vertice en una posicion de la matriz de forma intercalada, para que no queden todos en la misma linea
    let posiciones = [];
    let vertice = 0;
    for(let i = 0; i < matrizPosiciones.length; i++) {
        for(let j = 0; j < matrizPosiciones[i].length; j++) {
            if( cantVertices > vertice && ( (i+j) % extra === 0)) {
                const posicion = {
                    x: matrizPosiciones[i][j].x, 
                    y: matrizPosiciones[i][j].y
                }
                posiciones.push(posicion);
                vertice++;
            }
        }
    }

    return posiciones;
}

function generarVertices(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], posiciones: Posicion[]): Vertice[] {
    const vertices: Vertice[] = [];
    for (let i = 0; i < matrizAdyacencia.length; i++) {
        const nuevoVertice = new Vertice(i, null, fuentes[i], sumideros[i], posiciones[i], verticeRadio, null);
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
        for (let j = 0; j < i; j++) {

            if(j === i) continue;
            if(matrizAdyacencia[i][j] === 0 && matrizAdyacencia[j][i] === 0) continue;

            const origen = vertices[i];
            const destino = vertices[j];
            const esCamino = [false, false];
            const peso = [matrizAdyacencia[i][j], matrizAdyacencia[j][i]];
            const flujo = [0, 0];


            const nuevaArista = new Arista(origen, destino, esCamino, peso, flujo, null);
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

function asignarFuncionesGrafo(grafo: Grafo, recargarAristas: Function, recargarVertices: Function) {
    console.log("asignarFuncionesGrafo");

    grafo.recargarAristas = recargarAristas;
    grafo.recargarVertices = recargarVertices;
}

function generarGrafo(matrizAdyacencia: MatrizAdyacencia, posicionesVertices: Posicion[], fuentes: boolean[], sumideros: boolean[] , width: number, height: number, recargarVertices: Function, recargarAristas: Function, recargarGrafo: Function) : Grafo {
    const vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, posicionesVertices);
    const aristas = generarAristas(matrizAdyacencia, vertices);

    const grafo = new Grafo(matrizAdyacencia, fuentes, sumideros, vertices, aristas, width, height, recargarVertices, recargarAristas, recargarGrafo);

    matrizAdyacencia.asignarGrafo(grafo);
    asignarGrafoAVertices(vertices, grafo);
    asignarGrafoAAristas(aristas, grafo);

    return grafo;
}

function generarGrafoAlAzar(cantVertices: number, width: number, height: number, recargarVertices: Function, recargarAristas: Function, recargarGrafo: Function): Grafo {
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

    const posiciones = generarPosicionesVerticesw(cantVertices, width, height);

    return generarGrafo(matrizAdyacencia, posiciones, fuentes, sumideros , width, height, recargarVertices, recargarAristas, recargarGrafo);
}

export {
    generarGrafo,
    generarGrafoAlAzar,
}