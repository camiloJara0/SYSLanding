import { defineStore } from "pinia";
import { catalogo } from "~/data/catalogo";

export const useCatalogoStore = defineStore("catalogos", {
    state: () => ({
        loading: false,
        error: false,
        productos: catalogo,
        productoSeleccionado: {},
        categoriaSeleccionada: 0,
        busqueda: '',
        orden: 'asc',
    }),

    getters: {
        productosFiltrados(state) {
            return state.productos.filter((p) => {
                const coincideCategoria = !state.categoriaSeleccionada || p.CATEGORIA === state.categoriaSeleccionada;
                const coincideBusqueda = p.EQUIPO.toLowerCase().includes(state.busqueda.toLowerCase());
                return coincideBusqueda && coincideCategoria;
            });
        },

        buscandoProductos(state) {
            return state.productos.filter((p) => {
                return p.EQUIPO.toLowerCase().includes(state.busqueda.toLowerCase());
            });
        },

        categorias(state){
            return [...new Set(state.productos.map(p => p.CATEGORIA))].map(C => {
                return C
            })
        }
    },

    actions: {
        async llamaDatos() {
            try {
                this.loading = true
                this.error = null
                const [productosData, categoriasData] = await Promise.all([
                    traerProductos(),
                    traerCategorias()
                ])
                this.productos = productosData || []
                this.categorias = categoriasData || []
            } catch (err) {
                this.error = err.message || 'Error al cargar los datos. Por favor intenta nuevamente.'
                this.productos = []
                this.categorias = []
            } finally {
                this.loading = false
            }
        },

        seleccionarCategoria(categoriaId) {
            this.categoriaSeleccionada = categoriaId
        },

        ordenar() {
            if (this.orden === 'asc') {
                this.productos.sort((a, b) => a.EQUIPO.localeCompare(b.EQUIPO))
                this.orden = 'desc'
            } else {
                this.productos.sort((a, b) => b.EQUIPO.localeCompare(a.EQUIPO))
                this.orden = 'asc'
            }
        },

        borrarFiltros() {
            this.categoriaSeleccionada = 0
            this.busqueda = ''
            this.orden = 'asc'
            this.productos.sort((a, b) => a.EQUIPO.localeCompare(b.EQUIPO))
        },

        agregarProducto() {

        }

    }
});
