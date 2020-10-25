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
          <v-col cols="4" class="pb-0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-container class="text-button black white--text">
                  Issue Reported
                </v-container>
              </v-col>
              <v-col cols="6" align="end">
                <v-container class="text-button black white--text">
                  <v-btn dark x-small @click="showSolved = !showSolved">
                    {{ showSolved ? 'Hide Solved' : 'Show Solved' }}
                  </v-btn>
                </v-container>
              </v-col>
            </v-row>
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
          <v-col cols="4" class="pt-0">
            <v-card
              v-for="issue in showSolved ? allIssues : allIssues.filter(issue => {return !issue.is_solved})"
              :key="issue.id"
              tile
            >
              <v-card-title
                class="pb-2"
              >
                {{ issue.title.length >= 15 ? `${issue.title.substring(0,15)}..` : issue.title }} <v-spacer /> <v-btn
                  icon
                  color="info"
                  @click="showIssueDetail( {
                    ticketNumber: `3${String(issue.id).padStart(4, '0')}`,
                    title: issue.title,
                    body: issue.body,
                    category: issue.category,
                    user: issue.user ? issue.user.username : 'Anonymous'
                  })"
                >
                  <v-icon>mdi-details</v-icon>
                </v-btn>
                <v-btn icon @click="toggleIssueStatus(issue.id, issue.is_solved)">
                  <v-icon :color="issue.is_solved ? 'error' : 'success'">
                    {{ issue.is_solved ? 'mdi-close' : 'mdi-check' }}
                  </v-icon>
                </v-btn>
                <v-btn icon @click="deleteIssue(issue.id)">
                  <v-icon color="error">
                    mdi-trash-can
                  </v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle>
                <small>{{ `#${String(issue.id).padStart(4, '0')}` }}</small>
              </v-card-subtitle>
            </v-card>
            <v-dialog
              v-model="issuePopup"
              hide-overlay
              max-width="800"
            >
              <v-card>
                <v-card-title>
                  {{ issueDetail.title }}
                </v-card-title>
                <v-card-subtitle class="pb-0">
                  {{ `Ticket number: ${issueDetail.ticketNumber} User: ${issueDetail.user} Category: ${issueDetail.category}` }}
                </v-card-subtitle>
                <v-card-text class="black--text">
                  {{ issueDetail.body }}
                </v-card-text>
              </v-card>
            </v-dialog>
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
      newFeaturedArticle: '',
      showSolved: false,
      allIssues: [],
      issuePopup: false,
      issueDetail: {}
    }
  },
  computed: {
    ...mapGetters('blogStore', ['allBlogs']),
    ...mapGetters('adminPanel', ['allUsers'])
  },
  created () {
    this.getAllBlogs()
    this.getAllUsers()
    this.getAllIssues()
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
    },
    async getAllIssues () {
      try {
        const allIssues = await this.$axios.get('/issue/')
        this.allIssues = allIssues.data
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async toggleIssueStatus (id, status) {
      try {
        this.allIssues.find(element => element.id === id).is_solved = !status
        await this.$axios.patch(`/issue/${id}/`, { is_solved: !status })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async deleteIssue (id) {
      try {
        await this.$axios.delete(`/issue/${id}/`)
        this.allIssues = this.allIssues.filter((element) => { return element.id !== id })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    showIssueDetail ({ ticketNumber, title, body, category, user }) {
      this.issueDetail = { ticketNumber, title, body, category, user }
      this.issuePopup = true
    }
  },
  head () {
    return { title: 'Dashboard' }
  }
}
</script>

<style>

</style>
