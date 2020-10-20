<template>
  <client-only>
    <v-container id="admin_panel_dashboard">
      <adminNavbar />
      <v-container v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser">
        <v-row align="center" justify="center">
          <v-col cols="4" class="pb-0">
            <v-container class="text-button black white--text">
              Featured article
            </v-container>
          </v-col>
          <v-col cols="4" class="pb-0">
            <v-container class="text-button black white--text">
              Newest User
            </v-container>
          </v-col>
          <v-col cols="4" class="debug_border pb-0">
            <v-container class="text-button black white--text">
              Issue Reported
            </v-container>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="4" class="pt-0">
            <v-card v-for="blog in allBlogs.filter(blog => {return blog.is_featured})" :key="blog.slug" tile>
              <v-card-title>
                {{ blog.title.en.length >= 30 ? blog.title.en.substring(0, 30) + ".." : blog.title.en }}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-card v-for="user in allUsers.filter((element, index) => {return index >= allUsers.length-5})" :key="user.id" tile>
              <v-card-title>
                {{ user.username }} <v-spacer /><v-chip :color="user.email.filter(email => {return email.primary})[0].verified ? 'success' : 'error'">
                  {{ user.email.filter(email => {return email.primary})[0].verified ? 'verified' : 'not verified' }}
                </v-chip>
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="4" class="debug_border pt-0">
            <v-container class="pink">
              Issue Reported
            </v-container>
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
  computed: {
    ...mapGetters('blogStore', ['allBlogs']),
    ...mapGetters('adminPanel', ['allUsers'])
  },
  created () {
    this.getAllBlogs()
    this.getAllUsers()
  },
  methods: {
    ...mapActions('blogStore', ['getAllBlogs']),
    ...mapActions('adminPanel', ['getAllUsers'])
  }
}
</script>

<style>

</style>
