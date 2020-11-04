import errorResponseAlert from '@/helpers/axios-request-error'
const store = {
  state: () => ({
    allUsers: [],
    allGroups: []
  }),
  getters: {
    allUsers (state) {
      return state.allUsers
    },
    allGroups (state) {
      return state.allGroups
    }
  },
  actions: {
    async getAllUsers ({ commit }) {
      try {
        const allUsers = await this.$axios.get('/rest_admin/all_user/')
        commit('setUsers', allUsers.data)
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async updateUserGroups ({ dispatch }, { id, groups }) {
      try {
        await this.$axios.post(`/rest_admin/user/${id}/update_groups/`, groups)
        dispatch('getAllUsers')
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async deleteUser ({ dispatch }, id) {
      try {
        await this.$axios.post('/rest_admin/delete_user/', { id })
        dispatch('getAllUsers')
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async postGroup ({ dispatch }, { groupName, permissions }) {
      if (!groupName || groupName === '') {
        return
      }
      const postData = { name: groupName, permissions }
      try {
        await this.$axios.post('/rest_admin/group/', postData)
        dispatch('getAllGroups')
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async getAllGroups ({ commit }) {
      try {
        const allGroups = await this.$axios.get('/rest_admin/group/')
        commit('setGroups', allGroups.data)
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async patchGroup ({ dispatch }, { id, groupName, permissions }) {
      const patchData = { name: groupName, permissions }
      try {
        await this.$axios.patch(`/rest_admin/group/${id}/`, patchData)
        dispatch('getAllGroups')
        dispatch('getAllUsers')
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async deleteGroup ({ dispatch }, { id }) {
      try {
        await this.$axios.delete(`/rest_admin/group/${id}/`)
        dispatch('getAllGroups')
        dispatch('getAllUsers')
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  },
  mutations: {
    setUsers (state, allUsers) {
      state.allUsers = allUsers
    },
    setGroups (state, allGroups) {
      state.allGroups = allGroups
    }
  }
}

export const state = store.state
export const getters = store.getters
export const actions = store.actions
export const mutations = store.mutations
