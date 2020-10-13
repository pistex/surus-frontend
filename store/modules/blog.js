// no authentication needed for retrive blogs and tags
import Axios from '../../axios'
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
        const allBlogs = await Axios.get('/blog/')
        commit('setBlogs', allBlogs.data.reverse())
      } catch (error) {
        alert('Get blogs error')
        throw new Error(error)
      }
    },
    async getTags ({ commit }) {
      try {
        const allTags = await Axios.get('/tag/')
        commit('setTags', allTags.data)
      } catch (error) {
        alert('Get tags error')
        throw new Error(error)
      }
    },
    async getImages ({ commit }) {
      try {
        const Images = await Axios.get('/image/')
        commit('setImages', Images.data)
      } catch (error) {
        alert('Get images error')
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
