import { createStore } from 'vuex'

const defaultState = {
  count: 0,
  curComponentId: '',
  rect: {}
}

// Create a new store instance.
export default createStore({
  state() {
    return defaultState
  },
  mutations: {
    increment(state: typeof defaultState) {
      state.count++
    },
    setRect(state, rect) {
      state.rect = rect
    },
    setCurComponentId(state, id) {
      state.curComponentId = id
    },
    setShapeStyle({ curComponentId }, { top, left, width, height, rotate }) {
      const curComponent: HTMLElement = document.querySelector(`#${curComponentId}`) as HTMLElement
      if (top) curComponent.style.top = `${top}px`
      if (left) curComponent.style.left = `${left}px`
      if (width) curComponent.style.width = width
      if (height) curComponent.style.height = height
      if (rotate) curComponent.style.rotate = rotate
    }
  },
  actions: {
    increment(context) {
      context.commit('increment')
    },
    setCurComponentId({ commit }, id) {
      commit('setCurComponentId', id)
    },
    setRect({ commit }, rect) {
      commit('setRect', rect)
    },
    setShapeStyle({ commit }, pyload) {
      commit('setShapeStyle', pyload)
    }
  },
  getters: {
    double(state: typeof defaultState) {
      return 2 * state.count
    }
  }
})
