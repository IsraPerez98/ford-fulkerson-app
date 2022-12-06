Un apareamiento en un grafo bipartito (**Maximum Bipartite Matching MBP**) es un subconjunto de aristas que no tienen vértices en común. El problema de encontrar el apareamiento máximo en un grafo bipartito se puede resolver utilizando el algoritmo de flujo máximo.

Un problema simple de ejemplo puede ser el siguiente:

*"Existen n personas buscando trabajo y m empresas que están dispuestas a contratar. Cada persona tiene un subconjunto de trabajos en los que está interesado. Cada trabajo solo puede aceptar a un candidato, y cada persona solo puede ser contratada por una empresa. ¿Cuántas personas pueden ser contratadas?"*

Se puede representar el problema con el siguiente grafo bipartito:

<img alt="Grafo bipartito" src="/img/Ayuda/Aplicaciones/MBP/PersonasBuscandoTrabajo.png" width="300em" />

El problema de apareamiento en grafos bipartitos (Maximum Bipartite Matching MBP) puede ser resuelto al convertir el problema original en una red de flujo.

Inicialmente se crea una fuente *s* y un destino *t* y conectamos cada vértice de la parte izquierda del grafo con la fuente *s* y cada vértice de la parte derecha del grafo con el destino *t*. Luego se crea una arista entre cada vértice de la parte izquierda del grafo con cada vértice de la parte derecha del grafo. Cabe destacar que cada arista tiene una capacidad de *1*.

<img alt="Red de flujo del grafo bipartito" src="/img/Ayuda/Aplicaciones/MBP/PersonasBuscandoTrabajoComoGrafoDeFlujo.png" width="500em" />

Finalmente el flujo máximo encontrado es el número de personas que pueden ser contratadas.

<img alt="Flujo Máximo del Grafo" src="/img/Ayuda/Aplicaciones/MBP/FlujoMaximoDelGrafo.png" width="500em" />

En la red de flujo anterior, el flujo máximo equivale a 5, lo que significa que 5 personas pueden ser contratadas.