<template>
  <client-only>
    <v-container id="admin_panel_dashboard" class="pt-0">
      <adminNavbar />
      <v-container v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser" class="pt-0">
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
                <v-row no-gutters align="center" justify="center">
                  <v-col cols="10">
                    {{ blog.title.en.length >= 24 ? blog.title.en.substring(0, 24) + ".." : blog.title.en }}
                  </v-col>
                  <v-col cols="2">
                    <v-btn color="error" icon @click="removeFromFeatured(blog.id)">
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-title>
            </v-card>
            <v-container class="pl-0">
              <v-btn dark @click="featuredArticlePopup = true">
                add
              </v-btn>
            </v-container>
            <v-dialog
              v-model="featuredArticlePopup"
              hide-overlay
              max-width="600px"
            >
              <v-card>
                <v-card-title>
                  Select article
                </v-card-title>
                <v-select
                  v-model="newFeaturedArticle"
                  :items="allBlogs.filter(blog => {return !blog.is_featured}).map(blog=>blog.title.en)"
                  color="black"
                  class="px-4"
                />
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="success"
                    @click="addToFeatured()"
                  >
                    add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
import errorResponseAlert from '@/helpers/axios-request-error'

export default {
  components: { adminNavbar },
  data () {
    return {
      featuredArticlePopup: false,
      newFeaturedArticle: ''
    }
  },
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
    ...mapActions('adminPanel', ['getAllUsers']),
    async addToFeatured () {
      const onOldArticle = this.allBlogs.filter((blog) => { return blog.title.en === this.newFeaturedArticle })[0]
      const updateData = {
        title: onOldArticle.title,
        body: onOldArticle.body,
        tag: onOldArticle.tag,
        is_featured: true,
        reason: 'add to featured article'
      }
      try {
        await this.$axios.patch(`/blog/${onOldArticle.id}/`, updateData)
        await this.getAllBlogs()
        this.featuredArticlePopup = false
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async removeFromFeatured (id) {
      const onOldArticle = this.allBlogs.filter((blog) => { return blog.id === id })[0]
      const updateData = {
        title: onOldArticle.title,
        body: onOldArticle.body,
        tag: onOldArticle.tag,
        is_featured: false,
        reason: 'remove from featured article'
      }
      try {
        await this.$axios.patch(`/blog/${onOldArticle.id}/`, updateData)
        await this.getAllBlogs()
        this.featuredArticlePopup = false
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  }
}
</script>

<style>

</style>
