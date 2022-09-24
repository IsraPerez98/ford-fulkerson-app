import type TypeVertice  from '../../../interfaces/Vertice';
import type TypeArista from '../../../interfaces/Arista';
import type MatrizAdyacencia from '../../../interfaces/MatrizAdyacencia';

async function iniciarFlujoMaximo(vertices: TypeVertice[], aristas: TypeArista[][], matrizAdyacencia: MatrizAdyacencia, dibujarCamino: Function, printConsola: Function) {
    const fuentes = vertices.filter(vertice => vertice.fuente);
    const sumideros = vertices.filter(vertice => vertice.sumidero);

    if(fuentes.length === 0 || sumideros.length === 0) {
        alert("Debe haber al menos una fuente y un sumidero");
        console.log("Debe haber al menos una fuente y un sumidero");
        return;
    }

    if(fuentes.length > 1 || sumideros.length > 1) {
        //TODO: Hacer que funcione con mas de una fuente y mas de un sumidero
        alert("Solo puede haber una fuente y un sumidero");
        console.log("Solo puede haber una fuente y un sumidero");
        return;
    }

    const fuente = fuentes[0];
    const sumidero = sumideros[0];
    printConsola("Iniciando el calculo del flujo maximo...");
    await calcularFlujoMaximo(matrizAdyacencia, vertices, fuente, sumidero, dibujarCamino, printConsola);
    //avanzarFlujoMaximo(matrizAdyacencia, vertices, fuente, sumidero);
}

let avanzarIteracion = false;

function avanzarFlujoMaximo(matrizAdyacenci: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, sumidero: TypeVertice) {
    avanzarIteracion = true;
}

async function esperarProximaIteracion() {
    console.log("Esperando proxima iteracion");
    while(!avanzarIteracion) {
        //console.log("Esperando");
        await new Promise(r => setTimeout(r, 10));
    }
    //console.log("Avanzando");
    avanzarIteracion = false;
}

async function calcularFlujoMaximo( matrizAdyacencia: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, sumidero: TypeVertice, dibujarCamino: Function, printConsola: Function) : Promise<number> {
    let flujoMaximo = 0;
    let redResidual = matrizAdyacencia.map((arreglo) => [...arreglo]); //copiamos la matriz de adyacencia para crear la red residual
    
    printConsola("Iniciamos la variable de flujo maximo en 0");
    printConsola("Creamos la red residual como una copia de la matriz de adyacencia");
    await esperarProximaIteracion();

    while(true) {
        printConsola("Buscamos un camino desde la fuente al sumidero, utilizando la red residual");
        const camino = buscarCamino(redResidual, vertices, fuente, sumidero);
        if(!camino) {
            printConsola("No existe otro camino desde la fuente al sumidero, por lo tanto el flujo maximo es: " + flujoMaximo);
            console.log({flujoMaximo});
            alert("El flujo maximo es: " + flujoMaximo);
            return flujoMaximo
        }
        printConsola("Existe un camino desde la fuente al sumidero, pasando por los vertices: " + camino.map(vertice => vertice.id).join(", "));
        dibujarCamino(camino, 0);
        await esperarProximaIteracion();
        
        //calculamos el cuello de botella del camino
        printConsola("Calculamos el cuello de botella del camino, es decir el valor minimo de las aristas que lo componen");
        let cuelloBotella = Number.MAX_SAFE_INTEGER;
        for(let i = 0; i < camino.length - 1; i++) {
            const vertice = camino[i];
            const verticeSiguiente = camino[i + 1];
            //console.log({vertice, verticeSiguiente});
            //console.log({redResidual});
            const peso = redResidual[vertice.id][verticeSiguiente.id];
            //console.log({peso});
            if(peso < cuelloBotella) {
                cuelloBotella = peso;
            }
        }
        flujoMaximo += cuelloBotella;
        dibujarCamino(camino, cuelloBotella);

        //console.log({cuelloBotella});
        printConsola("El cuello de botella es: " + cuelloBotella);
        printConsola("Actualizamos el flujo maximo sumando el cuello de botella al flujo maximo actual que es: " + flujoMaximo);
        await esperarProximaIteracion();

        //actualizamos la red residual
        printConsola("Actualizamos la red residual, restando el cuello de botella a las aristas que componen el camino");
        for(let i = 0; i < camino.length - 1; i++) {
            const vertice = camino[i];
            const verticeSiguiente = camino[i + 1];
            redResidual[vertice.id][verticeSiguiente.id] -= cuelloBotella;
            //redResidual[verticeSiguiente.id - 1][vertice.id - 1] += cuelloBotella;
        }

        //console.log({redResidual});
        await esperarProximaIteracion();
    }

}

function buscarCamino(redResidual: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, destino: TypeVertice): TypeVertice[] {
    //DFS
    let visitados = new Array(redResidual.length).fill(false);

    let camino = [];
    
    camino = DFSRecursivo(redResidual, vertices, fuente, destino, visitados, camino);

    return camino;
}

function DFSRecursivo(redResidual: MatrizAdyacencia, vertices: TypeVertice[], verticeActual: TypeVertice, destino: TypeVertice, visitados: boolean[], camino: TypeVertice[]) : TypeVertice[] {
    visitados[verticeActual.id] = true;
    if(verticeActual === destino) {
        return [...camino, destino];
    }

    for(let i = 0; i < vertices.length; i++) {
        if(redResidual[verticeActual.id][i] !== 0 && !visitados[i]) {
            const caminoRecursivo = DFSRecursivo(redResidual, vertices, vertices[i], destino, visitados, [...camino, verticeActual]);

            if(caminoRecursivo) { // si existe un camino
                return caminoRecursivo;
            }
        }
    }

    return null;
}

function finalizarFlujoMaximo(arregloAristas: TypeArista[][], recargarAristas: Function) {
    //eliminamos los caminos
    for(let i = 0; i < arregloAristas.length; i++) {
        for(let j = 0; j < arregloAristas[i].length; j++) {
            const arista = arregloAristas[i][j];
            if(arista) {
                arista.esCamino = [false, false];
                arista.flujo = [0, 0];
            }
        }
    }

    recargarAristas();
}

export {
    iniciarFlujoMaximo,
    avanzarFlujoMaximo,
    finalizarFlujoMaximo,
}