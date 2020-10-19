<template>
  <client-only>
    <v-container id="admin_panel_dashboard">
      <adminNavbar />
      <v-container v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser">
        <v-row no-gutters>
          <v-col cols="4" class="debug_border">
            <v-row justify="center" no-gutters>
              <v-col cols="10">
                <v-row>
                  <v-col cols="12" class="text-button black white--text">
                    Featured article
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="debug_border">
            <v-row justify="center" no-gutters>
              <v-col cols="10">
                <v-row>
                  <v-col cols="12" class="text-button black white--text">
                    Newest user
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="debug_border">
            <v-row justify="center" no-gutters>
              <v-col cols="10">
                <v-row>
                  <v-col cols="12" class="text-button black white--text">
                    Reported issue
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </client-only>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import adminNavbar from '@/components/admin-navbar'
export default {
  components: { adminNavbar },
  data () {
    return {
      usersAreRetrived: null,
      groupsAreRetrived: null,
      addGroupName: null
    }
  },
  computed: {
    ...mapGetters('adminPanel', ['allUsers', 'allGroups'])
  },
  mounted () {
    this.getAllUsers()
    this.getAllGroups()
    const mainComponent = document.getElementsByClassName('v-main')
    mainComponent[0].className = 'v-main'
  },
  methods: {
    async getAllUsers () {
      this.usersAreRetrived = true
      await this.$store.dispatch('adminPanel/getAllUsers')
    },
    async getAllGroups () {
      this.groupsAreRetrived = true
      await this.$store.dispatch('adminPanel/getAllGroups')
    },
    async goToDetail (id) {
      await this.$router.push(this.$route.path + '/user/' + id)
    },
    async createGroup (groupName, permissions) {
      await this.$store.dispatch('adminPanel/createGroup', { groupName, permissions })
      this.addGroupName = null
    },
    ...mapActions('adminPanel', ['deleteUser', 'updateGroup', 'deleteGroup'])
  }
}
</script>

<style scoped>
.debug_border {
  border: black 1px solid;
}
</style>
