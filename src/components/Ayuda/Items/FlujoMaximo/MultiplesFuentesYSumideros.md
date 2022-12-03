Es posible definir una red de flujo con múltiples fuentes y destinos, en este caso se debe adaptar el diseño de la red para que se puedan utilizar los teoremas de flujo máximo y corte mínimo junto con los algoritmos de resolución.

Para ejecutar los algoritmos de resolucion de flujo maximo se requiere convertir una red con múltiples fuentes y destinos a una red con una sola fuente y un solo destino, para esto es necesario agregar una super-fuente o super-origen con aristas de capacidad infinita que partan desde la super-fuente y que se dirijan a cada una de las fuentes originales.
De igual forma es necesario agregar un super-destino con aristas de capacidad infinita que parten de cada uno de los destinos originales y que se dirijan al super-destino. Al realizar esto se obtiene un problema de flujo máximo con una sola fuente y un solo destino.

En la imagen que se presenta a continuación se presenta un ejemplo de un problema de flujo máximo con 5 fuentes y 3 destinos reducido a un problema con una sola fuente y un destino.

![Red con múltiples fuentes y destinos](/img/Ayuda/FlujoMaximo/MultiplesFuentesYSumideros/grafoOriginal.png)

Luego de realizar las modificaciones se obtiene la siguiente red:

![Red con una sola fuente y un destino](/img/Ayuda/FlujoMaximo/MultiplesFuentesYSumideros/grafoModificado.png)