import type Posicion from '../../../interfaces/Posicion';
import type TypeVertice  from '../../../interfaces/Vertice';
import type TypeArista from '../../../interfaces/Arista';
import type MatrizAdyacencia from '../../../interfaces/MatrizAdyacencia';

import {crearNuevaArista, destruirArista, cambiarPeso, cambiarPesoInverso } from './ModificacionAristas';

import {toggleFuente, toggleSumidero, eliminarVertice, moverVertice} from './ModificacionVertices';

const verticeRadio = 35;

function generarVertices(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], posiciones: Posicion[], recargarAristas: Function, maxWith: number, maxHeight: number): TypeVertice[] {
    //console.log(maxHeight);
    const arregloVertices: TypeVertice[] = [];
    matrizAdyacencia.forEach((arreglo, index) => {
        const nuevoVertice = {
            id: index,
            nombre: null,
            
            fuente: fuentes[index],
            sumidero: sumideros[index],

            //x: randomInt(verticeRadio, maxWith - (verticeRadio * 2)),
            //y: randomInt(verticeRadio, maxHeight - verticeRadio),
            x: posiciones[index].x,
            y: posiciones[index].y,

            mover: ( x: number, y: number) => moverVertice(nuevoVertice, recargarAristas , x, y, maxWith, maxHeight),
            crearArista: ( verticeY: TypeVertice, peso: number) => crearNuevaArista(nuevoVertice, verticeY, peso, matrizAdyacencia),
            eliminar: () => eliminarVertice(nuevoVertice, arregloVertices, matrizAdyacencia),
            toggleFuente: () => toggleFuente(nuevoVertice, fuentes),
            toggleSumidero: () => toggleSumidero(nuevoVertice, sumideros),
        };

        arregloVertices.push(nuevoVertice);
    });
    //centrarVertices(arregloVertices, maxWith, maxHeight);
    return arregloVertices;
}

function generarAristas(matrizAdyacencia: MatrizAdyacencia, arregloVertices: TypeVertice[]): TypeArista[][] {
    const arregloAristas: TypeArista[][] = [];
    //lenamos con null el arreglo de aristas
    matrizAdyacencia.forEach((arreglo) => {
        arregloAristas.push(new Array(arreglo.length).fill(null));
    });

    for (let i = 0; i < matrizAdyacencia.length; i++) {
        //arregloAristas.push([]);
        for (let j = 0; j < i; j++) {

            if(j === i) continue;
            if(matrizAdyacencia[i][j] === 0 && matrizAdyacencia[j][i] === 0) continue;

            const nuevaArista = {
                origen: arregloVertices[i],
                destino: arregloVertices[j],
                esCamino: [false, false],
                peso: [matrizAdyacencia[i][j], matrizAdyacencia[j][i]],
                flujo: [0, 0],

                //cambiarPeso: (peso: number) => cambiarPeso(nuevaArista, peso, matrizAdyacencia, recargarAristas),
                //cambiarPesoInverso: (peso: number) => cambiarPesoInverso(nuevaArista, peso, matrizAdyacencia, recargarAristas),
                cambiarPeso: (peso: number) => {},
                cambiarPesoInverso: (peso: number) => {},
                destruir: () => {},
            }
            //arregloAristas[i].push(nuevaArista);
            arregloAristas[i][j] = nuevaArista;
            //arregloAristas[j][i] = nuevaArista;
        }
    }

    return arregloAristas;
}

function asignarFuncionesAristas(arregloAristas: TypeArista[][], matrizAdyacencia: MatrizAdyacencia, recargarAristas: Function) {
    for(let i = 0; i < arregloAristas.length; i++) {
        for(let j = 0; j < i; j++) {
            if(arregloAristas[i][j] === null) continue;
            const arista = arregloAristas[i][j];

            arista.cambiarPeso = (peso: number) => cambiarPeso(arista, peso, matrizAdyacencia, recargarAristas);
            arista.cambiarPesoInverso = (peso: number) => cambiarPesoInverso(arista, peso, matrizAdyacencia, recargarAristas);
            arista.destruir = () => destruirArista(arista, arregloAristas, matrizAdyacencia, recargarAristas);
        }
    }
}

function generarPosicionesVertices(cantVertices: number, maxWith: number, maxHeight: number ) : Posicion[] {
    
    const extra = 2;

    const x_min = verticeRadio;
    const x_max = maxWith - (verticeRadio * 2);
    const y_min = verticeRadio;
    const y_max = maxHeight - verticeRadio;

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

function generarGrafoAlAzar(cantidad: number, width: number, height: number) : {matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], posiciones: Posicion[]} {
    const matrizAdyacencia: MatrizAdyacencia = [];

    for (let i = 0; i < cantidad; i++) {
        const arreglo: number[] = [];
        for (let j = 0; j < cantidad; j++) {
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

    //tomamos el primer vertice como fuente
    const fuentes: boolean[] = [];
    for (let i = 0; i < cantidad; i++) {
        if(i === 0) {
            fuentes.push(true);
        } else {
            fuentes.push(false);
        }
    }

    //tomamos el ultimo vertice como sumidero
    const sumideros: boolean[] = [];
    for (let i = 0; i < cantidad; i++) {
        if(i === cantidad - 1) {
            sumideros.push(true);
        } else {
            sumideros.push(false);
        }
    }

    const posiciones = generarPosicionesVertices(cantidad, width, height);

    return {matrizAdyacencia, fuentes, sumideros, posiciones};
}


export {
    generarVertices,
    generarAristas,
    asignarFuncionesAristas,
    generarGrafoAlAzar,
};