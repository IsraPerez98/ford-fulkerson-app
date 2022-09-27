import type Posicion from '../../../interfaces/Posicion';
import type TypeVertice  from '../../../interfaces/Vertice';
import type TypeArista from '../../../interfaces/Arista';
import type MatrizAdyacencia from '../../../interfaces/MatrizAdyacencia';

const verticeRadio = 35;

function crearNuevaArista(verticeX: TypeVertice, verticeY: TypeVertice, peso: number, matrizAdyacencia: MatrizAdyacencia) {
    if(matrizAdyacencia[verticeX.id][verticeY.id] !== 0) {
        alert("Ya existe una arista entre estos vertices");
        return;
    }
    
    matrizAdyacencia[verticeX.id][verticeY.id] = peso;
}

function destruirArista(arista: TypeArista, arregloAristas: TypeArista[][], matrizAdyacencia: MatrizAdyacencia, recargarAristas: Function) {
    matrizAdyacencia[arista.origen.id][arista.destino.id] = 0;
    matrizAdyacencia[arista.destino.id][arista.origen.id] = 0;
    arregloAristas[arista.origen.id][arista.destino.id] = null;
    arregloAristas[arista.destino.id][arista.origen.id] = null;
    recargarAristas();
}

function cambiarPeso(arista: TypeArista, peso: number, matrizAdyacencia: MatrizAdyacencia, recargarAristas: Function) {
    arista.peso = [peso, arista.peso[1]];
    matrizAdyacencia[arista.origen.id][arista.destino.id] = peso;
    if(arista.peso[0] === 0 && arista.peso[1] === 0) {
        arista.destruir();
    }
    recargarAristas();
}

function cambiarPesoInverso(arista: TypeArista, peso: number, matrizAdyacencia: MatrizAdyacencia, recargarAristas: Function) {
    arista.peso = [arista.peso[0], peso];
    matrizAdyacencia[arista.destino.id][arista.origen.id] = peso;
    if(arista.peso[0] === 0 && arista.peso[1] === 0) {
        arista.destruir();
    }
    recargarAristas();
}

function dibujarCamino(arregloAristas: TypeArista[][], camino: TypeVertice[], flujo: number, recargarAristas: Function) {
    for(let i = 0; i < camino.length - 1; i++) {
        const vertice = camino[i];
        const verticeSiguiente = camino[i + 1];

        //console.log({vertice, verticeSiguiente});
        //console.log({arregloAristas});

        const arista = arregloAristas[vertice.id][verticeSiguiente.id];

        if(arista) {
            console.log({arista});
            arista.esCamino = [true, arista.esCamino[1]];
            arista.flujo = [flujo, arista.flujo[1]];
        }
        

        const aristaInversa = arregloAristas[verticeSiguiente.id][vertice.id];

        if(aristaInversa) {
            console.log({aristaInversa});
            aristaInversa.esCamino = [aristaInversa.esCamino[0], true];
            aristaInversa.flujo = [aristaInversa.flujo[0], flujo];
        }
    }

    recargarAristas();
}

export {
    crearNuevaArista,
    destruirArista,
    cambiarPeso,
    cambiarPesoInverso,
    dibujarCamino,
}