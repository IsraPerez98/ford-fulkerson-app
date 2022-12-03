Una compañía de transporte marítimo necesita transportar bienes perecibles entre distintos puertos. Debido a que la carga es perecible se especifican fechas de entrega para cada carga, se requiere que la carga no llegue ni antes ni después de la fecha especificada. Se requiere conocer la cantidad mínima de barcos para cumplir las fechas de entrega.

Como ejemplo se consideran cuatro cargamentos, las características de los cargamentos, los tiempos de tránsito y los tiempos de retorno se incluyen en las tablas siguientes.

Características de los cargamentos:

![Características de cargamentos](/img/Ayuda/Aplicaciones/AsignacionDeBarcos/CaracteristicasCargamentos.png)

Tiempos de tránsito:

![Tiempos de tránsito](/img/Ayuda/Aplicaciones/AsignacionDeBarcos/TiemposDeTransito.png)

Tiempos de retorno:

![Tiempos de retorno](/img/Ayuda/Aplicaciones/AsignacionDeBarcos/TiemposDeRetorno.png)

Para resolver este problema se construye la red de flujo que se muestra en la figura. Esta red contiene un vértice para cada cargamento y una arista desde el vértice *i* hacia el vértice *j* en caso de que sea posible realizar la entrega *j* después de la entrega *i*, es decir el tiempo de inicio del cargamento *j *es menor o igual al tiempo de entrega de *i* más el tiempo de tránsito de *i* a *j*. Un camino dirigido en esta red corresponde a una posible secuencia de entregas. El problema requiere identificar el número mínimo de caminos dirigidos que contengan cada uno de los vértices en exactamente un camino.

Este problema puede ser transformado a uno de flujo máximo de la siguiente forma:

* Dividimos cada vértice *i* en dos vértices *i'* y *i''*.
* Se agrega la arista *(i', i'')*.
* Fijamos el límite inferior del flujo de la arista *(i', i'')* en *1*, de forma que al menos una unidad de flujo pase por esta arista.
* Añadimos la fuente *s* y la conectamos al origen de cada cargamento.
* Añadimos el sumidero *t* y conectamos cada destino de cada cargamento al sumidero.
* Fijamos la capacidad de cada arista de la red a un valor de *1*.


En la figura se representa la red de flujo resultante para el ejemplo. En esta red cada camino dirigido desde la fuente *s* hacia el sumidero *t* corresponde a una posible planificación para cada barco. Como resultado un flujo factible de valor *v* en esta red corresponde a una planificación de *v* barcos. De esta forma este problema se reduce en encontrar un flujo de valor mínimo, al ser un problema de valor mínimo puede ser resuelto con el algoritmo de flujo máximo.