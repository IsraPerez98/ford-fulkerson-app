Utilizando el teorema de flujo máximo y corte mínimo, se puede construir un algoritmo para encontrar el flujo máximo en una red de flujo. Este algoritmo se conoce como el algoritmo de Ford-Fulkerson.



El algoritmo se basa en repetir el siguiente proceso:

1. Construir una red residual *Gf*.
2. Encontrar una trayectoria de aumento *p* en *Gf*.
3. Aumentar el flujo en *p*.



El algoritmo termina cuando no exista una trayectoria de aumento en *Gf*. El flujo máximo en *G* es igual a la suma de los flujos en las aristas de la red residual *Gf*.



La complejidad del algoritmo de Ford-Fulkerson es de *O(|E| ⋅ f\*)*, donde *|E|* es el número de aristas y *f\** es el flujo máximo.



## Algoritmo de Edmonds-Karp



Originalmente el algoritmo de Ford-Fulkerson utiliza una búsqueda en profundidad para encontrar una trayectoria de aumento en la red residual **(DFS)**. Sin embargo, este algoritmo puede ser mejorado utilizando una búsqueda en amplitud **(BFS)**, el cual se conoce como el algoritmo de Edmonds-Karp.



Al realizar esta modificación, la complejidad del algoritmo de Edmonds-Karp es de *O(|V| ⋅ |E|^2)*, donde *|V|* es el número de vértices y *|E|* es el número de aristas.



Cabe destacar que en este algoritmo, la complejidad no depende de la variable de flujo maximo y por lo tanto es un algoritmo [**fuertemente polinomial**](https://es.wikipedia.org/wiki/Complejidad_temporal#Tiempo_polinomial_fuerte_y_d%C3%A9bil).



De forma paralela el científico soviético Yefim Dinitz en 1970 de forma independiente, logró desarrollar un algoritmo *O(|V| ⋅ |E|^2)* para encontrar el flujo máximo en una red de flujo, el cual se conoce como el algoritmo de Dinitz. Al igual que el algoritmo de Edmonds-Karp, este algoritmo utiliza una búsqueda en amplitud **(BFS)** para encontrar una trayectoria de aumento en la red residual.