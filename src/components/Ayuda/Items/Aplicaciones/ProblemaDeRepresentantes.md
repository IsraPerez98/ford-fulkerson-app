Una ciudad contiene *r* residentes *R<sub>1</sub>, R<sub>2</sub>, ... , R<sub>r</sub>* ; *q* clubs *C<sub>1</sub>, C<sub>2</sub>, ..., C<sub>q</sub>*; y *p* partidos políticos *P<sub>1</sub>, P<sub>2</sub>, ... , P<sub>p</sub>*. Cada reside es miembro de al menos un club y puede pertenecer a exactamente un partido político. Cada club debe nominar uno de sus miembros para representar el concejo de la ciudad de modo que el número de concejeros pertenecientes al partido *P<sub>k</sub>* sea como máximo *u<sub>k</sub>*. El problema consiste encontrar un concejo que satisfaga esta condición. 

Podemos considerar un problema con *r = 7, q = 4 y p = 3*. En la figura se muestra el problema como un problema de flujo máximo. Los vértices *R<sub>1</sub>. R<sub>2</sub>, ... , R<sub>7</sub>* representan a los residentes, los vértices *C<sub>1</sub>, C<sub>2</sub>, ... , C<sub>4</sub>* representan a los clubs y los vértices *P<sub>1</sub>, P<sub>2</sub>, ... , P<sub>3</sub>* representan a los partidos políticos. 

La red contiene un nodo fuente *s* y un nodo sumidero *t*. Contiene una arista (*s, C<sub>i</sub>)* para cada club *C<sub>i</sub>*. Una arista *(C<sub>i</sub>, R<sub>j</sub>)* existe si el residente *R<sub>j</sub>* es miembro del club *C<sub>i</sub>*. Una arista *(R<sub>j</sub>, P<sub>k</sub>)* existe si el residente *R<sub>j</sub>* pertenece al partido *P<sub>k</sub>*. Finalmente, se añade una arista *(P<sub>k</sub>, t)* para cada *k= 1, ... , 3* de capacidad *u<sub>k</sub>*; todas las otras aristas tienen capacidad *1*.

De esta forma si el flujo máximo de la red equivale a *q*, entonces existe un concejo que satisfaga la condición.

Este tipo de modelo tiene aplicaciones en distintos problemas de asignación de recursos. 
