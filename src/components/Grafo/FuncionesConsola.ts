function agregarTextoConsola(texto: string, textoMemoria: string[]) {
    console.log("CONSOLA: ", texto);
    textoMemoria.push(texto);
    if(textoMemoria.length > 3) {
        //textoMemoria.shift();
    }
    textoMemoria = textoMemoria;
}

export {
    agregarTextoConsola,
}