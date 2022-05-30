<script lang="ts">

    import AgregarNodo from "./Items/AgregarNodo.svelte";

    export let svggrafo: any;

    export let agregarNodo: Function;

    $: if (svggrafo) {
        items = generarItems();
        draw();
    }

    let items = generarItems();

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
                .attr("class", "flex flex-col");

            divItem.append("p")
                .attr("class", "text-center")
                .text(item.nombre);
            
            const divComponente = divItem.append("div")
                .attr("class", "flex mx-auto");

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
