import type Posicion from '../../../interfaces/Posicion';

import type Vertice from '../../../interfaces/Vertice';

function moverVertice(vertice: Vertice, posicion: Posicion): void {
    const nuevaPosicion: Posicion = {
        x: Math.max(vertice.radio, Math.min(vertice.grafo.width - (vertice.radio * 2), posicion.x)),
        y: Math.max(vertice.radio, Math.min(vertice.grafo.height - (vertice.radio), posicion.y)),
    };
    
    vertice.posicion = nuevaPosicion;

    vertice.grafo.recargarAristas();
}

export {
    moverVertice,
}