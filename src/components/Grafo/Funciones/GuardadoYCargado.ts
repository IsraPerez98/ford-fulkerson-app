import type MatrizAdyacencia from "../../../interfaces/MatrizAdyacencia";
import type TypeVertice  from '../../../interfaces/Vertice';
import type TypeArista  from '../../../interfaces/Arista';

import {generarAristas, generarVertices} from './GeneracionGrafo';

function guardarGrafo(matrizAdyacencia: MatrizAdyacencia, vertices: TypeVertice[], fuentes: boolean[], sumideros: boolean[]) {
    //guardamos las posiciones de los vertices
    const posiciones = vertices.map((vertice: any) => {
        return {
            x: vertice.x,
            y: vertice.y,
        }
    });
    const grafo = {
        matrizAdyacencia,
        fuentes,
        sumideros,
        posiciones,
    };

    //Descargar el archivo
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grafo));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "grafo.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}

async function cargarGrafo(width: number, height: number, recargarAristas: Function) : Promise<{matrizAdyacencia: MatrizAdyacencia, fuentes: boolean[], sumideros: boolean[], vertices: TypeVertice[], aristas: TypeArista[][]}> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => { 
            // referencia
            const file = (e.target as HTMLInputElement).files[0]; 

            // configurando el reader
            const reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            // cuando termina de leer
            reader.onload = readerEvent => {
                const contenido = (readerEvent.target as any).result;
                const grafo = JSON.parse(contenido);

                const matrizAdyacencia = grafo.matrizAdyacencia;
                const fuentes = grafo.fuentes;
                const sumideros = grafo.sumideros;
                const posiciones = grafo.posiciones;

                const vertices = generarVertices(matrizAdyacencia, fuentes, sumideros, posiciones, recargarAristas, width, height);
                const aristas = generarAristas(matrizAdyacencia, vertices, recargarAristas);
                resolve({
                    matrizAdyacencia,
                    fuentes,
                    sumideros,
                    vertices,
                    aristas,
                })
            }

            reader.onerror = reject;
        }

        input.click();
    });
}

export {
    guardarGrafo,
    cargarGrafo,
}