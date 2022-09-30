import type Arista from "../../../classes/Arista"
import Vertice from "../../../classes/Vertice"
import type Grafo from "../../../classes/Grafo"
import type Posicion from "../../../interfaces/Posicion";

function crearNuevoVerticeDinamico(grafo: Grafo) {
    //creamos un nuevo vertice falso
    const centro: Posicion = {
        x: grafo.width / 2,
        y: grafo.height / 2,
    };
    const nuevoVertice = new Vertice(grafo.vertices.length, false, false, centro, "Nuevo Vertice", null, grafo);

    //lo metemos al grafo para que sea renderizado
    grafo.vertices.push(nuevoVertice);
    grafo.recargarGrafo();

    //hacemos que el nuevo grafo siga al mouse
    const mousemove = (e: MouseEvent) => {
        nuevoVertice.mover({ x: e.clientX, y: e.clientY });
    }

    window.addEventListener("mousemove", mousemove);

    //cuando se haga click, se crea el vertice
    const mousedown = (e: MouseEvent) => {
        //eliminamos el vertice falso
        grafo.vertices.splice(grafo.vertices.indexOf(nuevoVertice), 1);

        //creamos el vertice real
        grafo.crearNuevoVertice(false, false, { x: e.clientX, y: e.clientY }, null, null);

        //quitamos los listeners
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mousedown);
    }

    window.addEventListener("mouseup", mousedown);
}

export {
    crearNuevoVerticeDinamico,
}