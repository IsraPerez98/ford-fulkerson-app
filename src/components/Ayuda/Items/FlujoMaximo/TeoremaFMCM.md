# Teorema de flujo máximo y corte mínimo

Este teorema fue propuesto inicialmente en 1956 por L. R. Ford y D. R. Fulkerson, el cual establece que el flujo máximo de una red de flujo es igual a la suma de las capacidades de las aristas, tales que si estas son eliminadas de la red, la fuente y el sumidero dejan de estar conectados.



Para este algoritmo se utilizan los conceptos de **redes residuales**, **trayectorias de aumento**, y los **cortes**.



## Redes residuales

Dada una red *G* y un flujo *f*, se puede construir una red residual *Gf* que contiene las aristas con la capacidad restante de *G*. Cada arista residual representada como *cf* se construye restando el flujo *f* a la capacidad de cada arista original, es decir, *cf(u,v) = c(u,v) - f(u,v)*. Solamente se consideran las aristas que puedan soportar mas flujo, es decir, aquellas que posean una capacidad residual *cf(u,v) > 0*.



## Trayectorias de aumento

Dada una red de flujo *G = (V,E)* y un flujo *f*, una trayectoria o camino de aumento *p* es un camino simple desde la fuente *s* hasta el sumidero *t*. Es posible aumentar el flujo en una arista *(u,v)* de una trayectoria de aumento *p* por una cantidad de *cf(u,v)*.



## Cortes

Un corte *s-t* *C = (S,T)* es una partición de los vértices *V* tal que *s ∈ S* y *t ∈ T*, donde *s* y *t* corresponden a los vértices fuente y destino respectivamente, es decir *s-t* es una división de los vértices de la red de flujo en dos partes, una incluye a la fuente y la otra al destino. El grupo de cortes *Xc* de un corte *C* es un grupo de vértices que conectan la fuente con el destino.

