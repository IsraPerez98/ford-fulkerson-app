import type Grafo from './Grafo';
import type Posicion from '../interfaces/Posicion';

class Vertice {
    public id: number; // representa un id utilizado para identificar el vetice
    public nombre: string | null; // representa el nombre del vetice, puede ser null si no se ha definido
    
    public fuente: boolean; // representa si el vetice es una fuente
    public sumidero: boolean; // representa si el vetice es un sumidero
    
    public posicion: Posicion; // representa la posicion del vertice en el canvas

    public radio: number; // representa el radio del vertice en el canvas
    
    public grafo: Grafo | null; // representa el grafo al que pertenece el vertice

    public mover(posicion: Posicion) : void { // mueve el vertice a la posicion indicada
        const nuevaPosicion: Posicion = {
            x: Math.max(this.radio, Math.min(this.grafo.width - (this.radio * 2), posicion.x)),
            y: Math.max(this.radio, Math.min(this.grafo.height - (this.radio), posicion.y)),
        };
        
        this.posicion = nuevaPosicion;
    
        this.grafo.recargarGrafo();
    }

    public eliminar(): void { // elimina el vertice del grafo
        this.grafo.eliminarVertice(this);
    }
    
    
    public toggleFuente(): void { // Funcion para cambiar el estado de fuente del vertice
        this.fuente = !this.fuente;
        this.grafo.fuentes[this.id] = this.fuente;
    }
    
    public toggleSumidero(): void { // Funcion para cambiar el estado de sumidero del vertice
        this.sumidero = !this.sumidero;
        this.grafo.sumideros[this.id] = this.sumidero;
    }

    public asignarGrafo(grafo: Grafo) : void { // asigna el grafo al vertice
        this.grafo = grafo;
    }

    public reposicionarLimites(width: number, height: number): void { // reposiciona el vertice en caso de que se haya cambiado el tamaño del canvas
        const nuevaPosX = Math.max(this.radio, Math.min(width - (this.radio * 2), this.posicion.x));
        const nuevaPosY = Math.max(this.radio, Math.min(height - (this.radio), this.posicion.y));
        
        if (nuevaPosX !== this.posicion.x || nuevaPosY !== this.posicion.y) {
            this.mover({ x: nuevaPosX, y: nuevaPosY });
        }
    }

    public recalcularRadio() : void {
        if(this.radio === 0 ) return;

        const nuevoRadio = this.calcularRadioDefault();

        this.radio = nuevoRadio;
    }

    private calcularRadioDefault(): number {
        let nuevoRadio = 35; // default
        
        if(window.innerWidth < 640) { //sm
            nuevoRadio = 25;
        }

        else if(window.innerWidth < 768) { //md
            nuevoRadio = 25;
        }

        else if(window.innerWidth < 1024) { //lg
            nuevoRadio = 30;
        }

        return nuevoRadio;
    }

    constructor(id: number, fuente: boolean, sumidero: boolean, posicion: Posicion, nombre?: string , radio?: number, grafo?: Grafo) {
        this.id = id;
        this.nombre = nombre || null;
        this.fuente = fuente;
        this.sumidero = sumidero;
        this.posicion = posicion;

        this.radio = (radio === undefined || radio === null) ? this.calcularRadioDefault() : radio;

        this.grafo = grafo || null;
    }
}

export default Vertice;
