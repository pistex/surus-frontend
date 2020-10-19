<template>
  <client-only>
    <v-container id="admin_panel_user">
      <adminNavbar />
      <v-sheet v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser">
        <v-card dark tile>
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12">
                Users
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="1">
              <v-card-subtitle class="black--text text-center text-button">
                ID
              </v-card-subtitle>
            </v-col>
            <v-col cols="1.5">
              <v-card-subtitle class="black--text text-center text-button">
                Username
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5">
              <v-card-subtitle class="black--text text-center text-button">
                Email
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5">
              <v-card-subtitle class="black--text text-center text-button">
                Joined Date
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5">
              <v-card-subtitle class="black--text text-center text-button">
                Last login
              </v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-card-subtitle class="black--text text-center text-button">
                actions
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
        <v-card>
          <v-row v-for="user in allUsers" :key="user.id" no-gutters tile>
            <v-col cols="1">
              <v-card-subtitle class="black--text text-center">
                {{ user.id }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="1.5" class="user_entry">
              <v-card-subtitle class="black--text">
                {{ user.username }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5" class="user_entry">
              <v-card-subtitle class="black--text">
                {{ user.email.filter(object => {return object.primary })[0].email }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5" class="user_entry">
              <v-card-subtitle class="black--text">
                {{ user.date_joined }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2.5" class="user_entry">
              <v-card-subtitle class="black--text">
                {{ user.last_login }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="user_entry">
              <v-card-actions>
                <v-btn color="info" :to="`/admin/user/${user.id}/`">
                  edit
                </v-btn>
                <v-spacer />
                <v-btn color="error" @click="deleteUser(user.id)">
                  delete
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-sheet>
    </v-container>
  </client-only>
</template>

<script>
import adminNavbar from '@/components/admin-navbar'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: { adminNavbar },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters('adminPanel', ['allUsers'])
  },
  created () {
    this.getAllUsers()
  },
  methods: {
    ...mapActions('adminPanel', ['getAllUsers', 'deleteUser'])
  }
}
</script>

<style>
.user_entry {
  border-left: 4px solid rgba(0, 0, 0, 0.4);
}
</style>
