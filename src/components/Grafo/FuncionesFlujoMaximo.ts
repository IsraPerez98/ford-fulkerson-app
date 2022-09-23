import type TypeVertice  from '../../interfaces/Vertice';
import type TypeArista from '../../interfaces/Arista';
import type MatrizAdyacencia from '../../interfaces/MatrizAdyacencia';

async function iniciarFlujoMaximo(vertices: TypeVertice[], aristas: TypeArista[][], matrizAdyacencia: MatrizAdyacencia) {
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
    await calcularFlujoMaximo(matrizAdyacencia, vertices, fuente, sumidero);
    //avanzarFlujoMaximo(matrizAdyacencia, vertices, fuente, sumidero);
}

let avanzarIteracion = false;

function avanzarFlujoMaximo(matrizAdyacenci: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, sumidero: TypeVertice) {
    avanzarIteracion = true;
}

async function esperarProximaIteracion() {
    while(!avanzarIteracion) {
        //console.log("Esperando");
        await new Promise(r => setTimeout(r, 300));
    }
    //console.log("Avanzando");
    avanzarIteracion = false;
}

async function calcularFlujoMaximo( matrizAdyacencia: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, sumidero: TypeVertice) : Promise<number> {
    let flujoMaximo = 0;
    let redResidual = matrizAdyacencia.map((arreglo) => [...arreglo]); //copiamos la matriz de adyacencia para crear la red residual
    while(true) {
        const camino = buscarCamino(redResidual, vertices, fuente, sumidero);
        if(!camino) {
            console.log({flujoMaximo});
            alert("El flujo maximo es: " + flujoMaximo);
            return flujoMaximo
        }
        console.log({camino});
        //dibujarcamino(camino);
        
        await esperarProximaIteracion();
        
        //calculamos el cuello de botella del camino
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

        console.log({cuelloBotella});
        await esperarProximaIteracion();

        //actualizamos la red residual
        for(let i = 0; i < camino.length - 1; i++) {
            const vertice = camino[i];
            const verticeSiguiente = camino[i + 1];
            redResidual[vertice.id][verticeSiguiente.id] -= cuelloBotella;
            //redResidual[verticeSiguiente.id - 1][vertice.id - 1] += cuelloBotella;
        }

        console.log({redResidual});
        await esperarProximaIteracion();
    }

}

function buscarCamino(redResidual: MatrizAdyacencia, vertices: TypeVertice[], fuente: TypeVertice, destino: TypeVertice) {
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

export {
    iniciarFlujoMaximo,
    avanzarFlujoMaximo,
}