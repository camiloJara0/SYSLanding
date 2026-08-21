import { defineStore } from 'pinia'
import { catalogo } from '~/data/catalogo'

const STORAGE_KEY = 'sys_carrito'

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    productos: [],
    modalAbierto: false,
    modoModal: 'productos',
    servicioModal: null
  }),

  getters: {
    totalProductos(state) {
      return state.productos.length
    },

    estaEnCarrito(state) {
      return nombre => state.productos.some(p => p.EQUIPO === nombre)
    },

    recomendaciones(state) {
      return catalogo
        .filter(p => !state.productos.some(c => c.EQUIPO === p.EQUIPO))
        .slice(0, 4)
    }
  },

  actions: {
    init() {
      if (!import.meta.client) return

      try {
        const guardado = localStorage.getItem(STORAGE_KEY)

        if (guardado) {
          this.productos = JSON.parse(guardado)
        }
      } catch {
        this.productos = []
      }
    },

    persistir() {
      if (!import.meta.client) return

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productos))
      } catch {
        // storage no disponible
      }
    },

    agregarProducto(producto) {
      if (this.productos.some(p => p.EQUIPO === producto.EQUIPO)) {
        return false
      }

      this.productos.push(producto)
      this.persistir()
      return true
    },

    quitarProducto(nombre) {
      this.productos = this.productos.filter(p => p.EQUIPO !== nombre)
      this.persistir()
    },

    limpiarCarrito() {
      this.productos = []
      this.persistir()
    },

    abrirModalProductos() {
      this.modoModal = 'productos'
      this.servicioModal = null
      this.modalAbierto = true
    },

    abrirModalServicio(servicio) {
      this.modoModal = 'servicio'
      this.servicioModal = servicio
      this.modalAbierto = true
    },

    cerrarModal() {
      this.modalAbierto = false
    }
  }
})
