<script lang="ts">

    import AgregarNodo from "./Items/AgregarNodo.svelte";
    import AgregarArista from "./Items/AgregarArista.svelte";
    import EliminarNodo from "./Items/EliminarNodo.svelte";

    export let svggrafo: any;

    export let agregarNodo: Function;
    
    export let toggleCreacionArista: Function;
    export let creandoArista: boolean;

    export let toggleEliminacionNodo: Function;
    export let eliminandoNodo: boolean;

    let items;

    $: if (svggrafo) {
        items = generarItems();
        draw();
        drawItems();
    }

    $: if(creandoArista !== undefined || eliminandoNodo !== undefined) {
        items = generarItems();
        drawItems();
    }


    function generarItems() {
        return [
            {
                nombre: "Agregar Nodo",
                componente: AgregarNodo,
                props: {
                    svggrafo: svggrafo,
                    agregarNodo: agregarNodo,
                }
            },
            {
                nombre: "Agregar Arista",
                componente: AgregarArista,
                props: {
                    toggleCreacionArista: toggleCreacionArista,
                    creandoArista: creandoArista,
                }
            },
            {
                nombre: "Eliminar Nodo",
                componente: EliminarNodo,
                props: {
                    toggleEliminacionNodo: toggleEliminacionNodo,
                    eliminandoNodo: eliminandoNodo,
                }
            },
            
        ];
    }


    let fomenu: any;
    let divMenu: any;

    function draw() {
        if(!svggrafo) {
            return;
        }

        console.log("Dibujando Menu");

        if(fomenu) {
            fomenu.remove();
        }

        fomenu = svggrafo.append("foreignObject")
            .attr("width", "100%")
            .attr("height", "100%");

        divMenu = fomenu.append("xhtml:div")
            .attr("class", "flex flex-row");
    }

    function drawItems() {
        if(!divMenu) {
            return;
        }
        
        divMenu.selectAll("*").remove();
        
        for (const item of items) {
            const divItem = divMenu.append("div")
                .attr("class", "flex flex-col mx-2");

            divItem.append("p")
                .attr("class", "text-center")
                .text(item.nombre);
            
            const divComponente = divItem.append("div")
                .attr("class", "flex");

            const componente = new item.componente({
                target: divComponente.node(),
                props: {
                    ...item.props,
                    divComponente,
                },
            });

        }
    }


</script>
