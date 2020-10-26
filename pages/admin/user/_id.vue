<template>
  <client-only>
    <v-container :id="`user_detail${$route.params.id}`">
      <adminNavbar />
      <v-sheet v-if="!!this.$auth.user.is_superuser && userDetail">
        <v-card dark tile>
          <v-card-title class="pa-0">
            <v-row v-if="userDetail" no-gutters align="center">
              <v-col cols="10" class="info_entry py-4 px-4">
                {{ userDetail.username }} <v-spacer />
              </v-col>
              <v-col cols="2" align="end" class="pr-2">
                <v-btn color="error">
                  delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Username
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.username }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              First Name
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.first_name !== '' ? userDetail.first_name : 'not set' }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Last Name
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.last_name !== '' ? userDetail.last_name : 'not set' }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 text-button">
              Email
            </v-col>
            <v-col cols="4" align="center" class="left-border buttom-border py-2 text-button">
              email address
            </v-col>
            <v-col cols="3" align="center" class="left-border buttom-border py-2 text-button">
              primary
            </v-col>
            <v-col cols="3" align="center" class="left-border buttom-border py-2 text-button">
              verified
            </v-col>
          </v-row>
          <v-row v-for="(email, index) in userDetail.email" :key="email.email" no-gutters>
            <v-col cols="2" align="center" :class="index+1 === userDetail.email.length ? 'py-2 buttom-border': 'py-2'" />
            <v-col cols="4" align="center" class="left-border buttom-border py-2">
              {{ email.email }}
            </v-col>
            <v-col cols="3" align="center" class="left-border buttom-border py-2">
              {{ email.primary }}
            </v-col>
            <v-col cols="3" align="center" class="left-border buttom-border py-2">
              {{ email.verified }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 text-button">
              Social Media
            </v-col>
            <v-col cols="5" align="center" class="left-border buttom-border py-2 text-button">
              Facebook
            </v-col>
            <v-col cols="5" align="center" class="left-border buttom-border py-2 text-button">
              Google
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border" />
            <v-col cols="5" align="center" class="left-border buttom-border py-2">
              {{ userDetail.social.facebook }}
            </v-col>
            <v-col cols="5" align="center" class="left-border buttom-border py-2">
              {{ userDetail.social.google }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-6 my-auto buttom-border text-button">
              Groups
            </v-col>
            <v-col cols="10" align="start" class="px-4 left-border buttom-border">
              <v-combobox
                v-model="newUserGroup"
                color="black"
                :items="allGroups.map(group => (group.name)) "
                hide-selected
                multiple
                chips
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Superuser
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.is_superuser }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Active
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.is_active }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Joined date
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.date_joined }}
            </v-col>
          </v-row>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="2" align="center" class="py-2 buttom-border text-button">
              Last Login
            </v-col>
            <v-col cols="10" align="start" class="pl-4 py-4 my-auto left-border buttom-border">
              {{ userDetail.last_login }}
            </v-col>
          </v-row>
        </v-card>
      </v-sheet>
      <v-container class="center text-center">
        <v-btn color="success" @click="saveUser()">
          Save
        </v-btn>
      </v-container>
    </v-container>
  </client-only>
</template>

<script>
import adminNavbar from '@/components/admin-navbar'
import errorResponseAlert from '@/helpers/axios-request-error'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    adminNavbar
  },
  data () {
    return {
      userDetail: null,
      currentUserGroup: null,
      newUserGroup: null
    }
  },
  computed: {
    ...mapGetters('adminPanel', ['allGroups'])
  },
  async created () {
    await this.getUserDetail()
    await this.getAllGroups()
    this.currentUserGroup = this.userDetail.groups
    this.newUserGroup = this.userDetail.groups
  },
  methods: {
    ...mapActions('adminPanel', ['getAllGroups', 'updateUserGroups']),
    async getUserDetail () {
      try {
        const response = await this.$axios.get(`rest_admin/user/${this.$route.params.id}/`)
        this.userDetail = response.data
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    saveUser () {
      const groupIsChanged = JSON.stringify(this.currentUserGroup.sort()) !== JSON.stringify(this.newUserGroup.sort())
      if (groupIsChanged) {
        this.updateUserGroups({ id: this.$route.params.id, groups: this.newUserGroup })
      }
    }
  },
  head () {
    return { title: this.userDetail ? `Editing user ${this.userDetail.username}` : 'Loading...' }
  }
}
</script>

<style>
.buttom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.left-border {
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
