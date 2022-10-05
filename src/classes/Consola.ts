
import type Grafo from "./Grafo";

class Consola {
    public grafo: Grafo | null;

    private categorias = [
        "EXPLICACION",
        "PSEUDOCODIGO",
        "RED_RESIDUAL",
    ]

    public categoria = this.categorias[0];

    public textoExplicativo: string[];

    public pseudoCodigo = [
        "DEFINIR FLUJO_MAXIMO = 0",
        "DEFINIR RED_RESIDUAL = MATRIZ_ADYACENCIA",
        "CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)",
        "MIENTRAS EXISTA CAMINO:",
        "    FLUJO_MINIMO = MINIMO(CAPACIDADES(CAMINO))",
        "    FLUJO_MAXIMO = FLUJO_MAXIMO + FLUJO_MINIMO",
        "    ACTUALIZAR_CAPACIDADES(RED_RESIDUAL ,CAMINO, FLUJO_MINIMO)",
        "    CAMINO = ENCONTRAR_CAMINO_AUMENTANTE(RED_RESIDUAL, FUENTE, SUMIDERO)",
        "FIN_MIENTRAS",
        "RETORNAR FLUJO_MAXIMO"
    ];

    public ubicacionPseudoCodigo = -1;

    public cambiarCategoria(categoria: string) {
        if(this.categorias.indexOf(categoria) === -1) {
            console.log("Categoría no valida: " + categoria);
            return;
        }

        this.categoria = categoria;
        this.grafo.recargarGrafo();
    }

    public setUbicacionPseudoCodigo(pseudocidigo: string) {
        const posicion = this.pseudoCodigo.indexOf(pseudocidigo);

        if(posicion === -1) {
            console.log("Pseudocódigo no valido: " + pseudocidigo);
            return;
        }

        this.ubicacionPseudoCodigo = posicion;
        this.grafo.recargarGrafo();
    }

    public printTextoExplicativo(texto: string) {
        
        const maxTextoExplicativo = 1000;
        
        this.textoExplicativo.push(texto);
        if(this.textoExplicativo.length > maxTextoExplicativo) {
            this.textoExplicativo.shift();
        }

        this.grafo.recargarGrafo();
    }

    
    public asignarGrafo(grafo: Grafo) {
        this.grafo = grafo;
    }

    constructor(grafo?: Grafo) {
        this.textoExplicativo = [];
        this.grafo = grafo || null;
    }
}

export default Consola;