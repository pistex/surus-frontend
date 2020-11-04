import errorResponseAlert from '@/helpers/axios-request-error'
const store = {
  state: () => ({
    allBlogs: [],
    allTags: [],
    allImages: []
  }),
  getters: {
    allBlogs (state) {
      return state.allBlogs
    },
    allTags (state) {
      return state.allTags
    },
    allImages (state) {
      return state.allImages
    }
  },
  actions: {
    async getAllBlogs ({ commit }) {
      try {
        const allBlogs = await this.$axios.get('/blog/')
        commit('setBlogs', allBlogs.data)
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async getTags ({ commit }) {
      try {
        const allTags = await this.$axios.get('/tag/')
        commit('setTags', allTags.data)
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async getImages ({ commit }) {
      try {
        const Images = await this.$axios.get('/image/')
        commit('setImages', Images.data)
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  },
  mutations: {
    setBlogs (state, allBlogs) {
      state.allBlogs = allBlogs
    },
    setTags (state, allTags) {
      state.allTags = []
      allTags.forEach((element) => { state.allTags.push(element.text) })
    },
    setImages (state, allImages) {
      state.allImages = allImages
    }
  }
}

export const state = store.state
export const getters = store.getters
export const actions = store.actions
export const mutations = store.mutations
