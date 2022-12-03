Esta aplicación se enfoca en asignar diferentes módulos o subrutinas de un programa a dos procesadores de forma que se minimice el costo de comunicación entre procesadores y computación. Se considera un computador con dos procesadores, no es necesario que sean idénticos. Se desea ejecutar un programa en este sistema. Cada programa contiene distintos módulos que interactúan entre sí durante la ejecución del programa. El costo de ejecución de cada módulo se conoce de antemano y varía entre ambos procesador por sus diferencias en diseño de memoria, control, velocidad y capacidades aritméticas.

Sea *α<sub>i</sub>* y *β<sub>i</sub>* el costo de ejecución del módulo *i* en el procesador *1* y *2* respectivamente.
Sea *c<sub>ij</sub>* el costo de comunicación si los módulos *i* y *j* están asignados a distintos procesadores, este costo no existe en caso de que ambos módulos sean asignados a un mismo procesador.
Se busca minimizar el costo de ejecución y el costo de comunicación entre procesadores.

Se puede formular este problema como un problema de corte mínimo en una red no dirigida de la siguiente forma:

* Dividimos cada vértice *i* en dos vértices *i'* y *i''*.
* Se agrega la arista *(i', i'')*.
* Fijamos el límite inferior del flujo de la arista *(i', i'')* en *1*, de forma que al menos una unidad de flujo pase por esta arista.
* Añadimos la fuente *s* y la conectamos al origen de cada cargamento.
* Añadimos el sumidero *t* y conectamos cada destino de cada cargamento al sumidero.
* Fijamos la capacidad de cada arista de la red a un valor de *1*.


Como ejemplo se tiene el programa definido en las tablas a continuación donde se definen los costos del programa:

Costos de computación:

![Costos de computación](/img/Ayuda/Aplicaciones/ComputacionDistribuida/CostosDeComputacion.png)

Costos de comunicación:

![Costos de comunicación](/img/Ayuda/Aplicaciones/ComputacionDistribuida/CostosDeComunicacion.png)


En la figura se presenta la red de flujo resultante para el ejemplo.


De esta forma se observa una correspondencia entre los cortes *s-t* de la red y las asignaciones de módulos a procesadores. La capacidad de un corte equivale al costo de la asignación correspondiente.
Para establecer este resultado, sean *A<sub>1</sub>* y *A<sub>2</sub>* asignaciones de módulos a los procesadores *1* y *2* respectivamente. El costo de esta asignación es:

![Costo de la asignación](/img/Ayuda/Aplicaciones/ComputacionDistribuida/EcuacionCostoAsignacion.png)

El corte *s-t* correspondiente a esta asignacion es *(｛s｝ ∪ A<sub>1</sub>, ｛t｝ ∪ A<sub>2</sub>)*. Este corte contiene una arista *(i,t)* para cada módulo *i ∈ A<sub>1</sub>* de capacidad *α<sub>i</sub>* y una arista *(s,i)*  para cada modulo *i ∈ A<sub>2</sub>* de capacidad *β<sub>i</sub>* y todas las aristas *(i,j)* de *i \∈ A<sub>1</sub>* y *j ∈ A<sub>2</sub>* con capacidad *c<sub>ij</sub>*. 

El costo de la asignación *A<sub>1</sub>* y *A<sub>2</sub>* equivale a la capacidad del corte *(｛s｝ ∪ A<sub>1</sub>, ｛t｝ ∪ A<sub>2</sub>)*.
De forma que el corte mínimo *s-t* de la red entrega la asignación de módulos que minimiza el costo de ejecución y comunicación entre procesadores.