interface ItemAyuda {
    titulo: string;
    componente: any;
}

interface Categoria {
    titulo: string;
    items: ItemAyuda[];
}

interface ItemsAyuda {
    categorias: Categoria[];
}

export default ItemsAyuda;