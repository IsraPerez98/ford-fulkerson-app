import type TypeVertice  from '../../interfaces/Vertice';
import type TypeArista from '../../interfaces/Arista';
import type MatrizAdyacencia from '../../interfaces/MatrizAdyacencia';

const verticeRadio = 35;

function generarVertices(matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], recargarAristas: Function, maxWith: number, maxHeight: number): TypeVertice[] {
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
            x: 0,
            y: 0,

            mover: ( x: number, y: number) => moverVertice(nuevoVertice, recargarAristas , x, y, maxWith, maxHeight),
            crearArista: ( verticeY: TypeVertice, peso: number) => crearNuevaArista(nuevoVertice, verticeY, peso, matrizAdyacencia),
            eliminar: () => eliminarVertice(nuevoVertice, arregloVertices, matrizAdyacencia),
            toggleFuente: () => toggleFuente(nuevoVertice),
            toggleSumidero: () => toggleSumidero(nuevoVertice),
        };

        arregloVertices.push(nuevoVertice);
    });
    centrarVertices(arregloVertices, maxWith, maxHeight);
    return arregloVertices;
}

function generarAristas(matrizAdyacencia: MatrizAdyacencia, arregloVertices: TypeVertice[]): TypeArista[][] {
    const arregloAristas: TypeArista[][] = [];
    for (let i = 0; i < matrizAdyacencia.length; i++) {
        arregloAristas.push([]);
        for (let j = 0; j < matrizAdyacencia.length; j++) {
            if( i !== j && matrizAdyacencia[i][j] !== 0) {
                const nuevaArista = {
                    origen: arregloVertices[i],
                    destino: arregloVertices[j],
                    esCamino: [false, false],
                    peso: [matrizAdyacencia[i][j], matrizAdyacencia[j][i]],
                    flujo: [0, 0],

                    cambiarPeso: (peso: number) => cambiarPeso(nuevaArista, peso, matrizAdyacencia),
                    cambiarPesoInverso: (peso: number) => cambiarPesoInverso(nuevaArista, peso, matrizAdyacencia),
                }
                arregloAristas[i].push(nuevaArista);
            }
        }
    }

    return arregloAristas;
}
function toggleFuente(vertice: TypeVertice) {
    if(vertice.sumidero) {
        alert("No se puede hacer un vertice fuente y sumidero a la vez");
        return;
    }
    vertice.fuente = !vertice.fuente;
}

function toggleSumidero(vertice: TypeVertice) {
    if(vertice.fuente) {
        alert("No se puede hacer un vertice fuente y sumidero a la vez");
        return;
    }
    vertice.sumidero = !vertice.sumidero;
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

function crearNuevaArista(verticeX: TypeVertice, verticeY: TypeVertice, peso: number, matrizAdyacencia: MatrizAdyacencia) {
    if(matrizAdyacencia[verticeX.id][verticeY.id] !== 0) {
        alert("Ya existe una arista entre estos vertices");
        return;
    }
    
    matrizAdyacencia[verticeX.id][verticeY.id] = peso;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function centrarVertices(arregloVertices: TypeVertice[], maxWith: number, maxHeight: number ) {
    const x_min = verticeRadio;
    const x_max = maxWith - (verticeRadio * 2);
    const y_min = verticeRadio;
    const y_max = maxHeight - verticeRadio;

    const cantVertices = arregloVertices.length;
    const divisiones = Math.sqrt(cantVertices);
    const divisiones_x = Math.round(divisiones);
    const divisiones_y = Math.ceil(divisiones);

    //console.log({divisiones_x, divisiones_y});

    const x_div = Math.floor((x_max - x_min) / divisiones_x);
    const y_div = Math.floor((y_max - y_min) / divisiones_y);


    const x_mid_offset = Math.floor(x_div / 2);
    const y_mid_offset = Math.floor(y_div / 2);

    for (let i = 0; i < arregloVertices.length; i++) {
        const x = x_min + (x_div * (i % divisiones_x)) + x_mid_offset;
        const y = y_min + (y_div * Math.floor(i / divisiones_x)) + y_mid_offset;

        arregloVertices[i].x = x;
        arregloVertices[i].y = y;
    }

}

function generarGrafoAlAzar(cantidad: number) : {matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[]} {
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

    return {matrizAdyacencia, fuentes, sumideros};
}

function cambiarPeso(arista: TypeArista, peso: number, matrizAdyacencia: MatrizAdyacencia,) {
    arista.peso = [peso, arista.peso[1]];
    matrizAdyacencia[arista.origen.id][arista.destino.id] = peso;
}

function cambiarPesoInverso(arista: TypeArista, peso: number, matrizAdyacencia: MatrizAdyacencia) {
    arista.peso = [arista.peso[0], peso];
    matrizAdyacencia[arista.destino.id][arista.origen.id] = peso;
}


export {
    generarVertices,
    generarAristas,
    generarGrafoAlAzar,
};