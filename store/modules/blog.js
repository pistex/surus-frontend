// no authentication needed for retrive blogs and tags
export const blogStore = {
  namespaced: true,
  state: {
    allBlogs: [],
    allTags: [],
    allImages: []
  },
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
    async getBlogs ({ commit }) {
      try {
        const allBlogs = await this.$axios.get('/blog/')
        commit('setBlogs', allBlogs.data.reverse())
      } catch (error) {
        throw new Error(error)
      }
    },
    async getTags ({ commit }) {
      try {
        const allTags = await this.$axios.get('/tag/')
        commit('setTags', allTags.data)
      } catch (error) {
        throw new Error(error)
      }
    },
    async getImages ({ commit }) {
      try {
        const Images = await this.$axios.get('/image/')
        commit('setImages', Images.data)
      } catch (error) {
        throw new Error(error)
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
