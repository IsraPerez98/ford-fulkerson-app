<script lang="ts">

    import AgregarNodo from "./Items/AgregarNodo.svelte";
    import AgregarArista from "./Items/AgregarArista.svelte";

    export let svggrafo: any;

    export let agregarNodo: Function;
    
    export let toggleCreacionArista: Function;
    export let creandoArista: boolean;

    let items;

    $: if (svggrafo) {
        items = generarItems();
        draw();
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
        ];
    }


    let fomenu: any;

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

        const divMenu = fomenu.append("xhtml:div")
            .attr("class", "flex flex-row");
        
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
