<template>
  <v-container id="admin_panel_blog">
    <client-only>
      <adminNavbar />
      <v-sheet v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser">
        <v-card dark tile>
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12">
                Blogs
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="4">
              <v-card-subtitle class="black--text text-center text-button">
                title
              </v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-card-subtitle class="black--text text-center text-button">
                author
              </v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-card-subtitle class="black--text text-center text-button">
                Created date
              </v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-card-subtitle class="black--text text-center text-button">
                last modified
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
          <v-row v-for="blog in allBlogs" :key="blog.id" no-gutters tile>
            <v-col cols="4" class="blog_entry">
              <v-card-subtitle class="black--text">
                {{ blog.title.en.length >= 50 ? `${blog.title.en.substring(0, 50)}..`: blog.title.en }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="blog_entry">
              <v-card-subtitle class="black--text">
                {{ blog.author.username }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="blog_entry">
              <v-card-subtitle class="black--text">
                {{ filterBlogHistory(blog.id) ? filterBlogHistory(blog.id)[filterBlogHistory(blog.id).length -1] : null }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="blog_entry">
              <v-card-subtitle class="black--text">
                {{ filterBlogHistory(blog.id) ? filterBlogHistory(blog.id)[1] : null }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="blog_entry">
              <v-card-actions>
                <v-btn color="info" :to="`/blog/${blog.slug}/edit/`">
                  edit
                </v-btn>
                <v-spacer />
                <v-btn color="error" @click="deleteBlog(blog.id)">
                  delete
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-sheet>
      <v-container class="pl-0">
        <v-btn dark to="/blog/create">
          Create
        </v-btn>
      </v-container>
    </client-only>
  </v-container>
</template>

<script>
import adminNavbar from '@/components/admin-navbar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { adminNavbar },
  asyncData () {
    return {
    }
  },
  data () {
    return {
      blogHistory: []
    }
  },
  computed: {
    ...mapGetters('blogStore', ['allBlogs', 'allImages'])
  },
  async created () {
    await this.getImages()
    await this.getAllBlogs()
    // if (process.client) {
    await this.allBlogs.forEach(async (blog) => {
      const response = await this.$axios.get(`/blog/${blog.id}/`)
      this.blogHistory.push({ id: blog.id, ...response.data.history })
    })
    // }
  },
  methods: {
    ...mapActions('blogStore', ['getAllBlogs', 'getImages']),
    filterBlogHistory (id) {
      if (this.blogHistory.filter((object) => { return object.id === id }).length > 0) {
        return Object.keys(this.blogHistory.filter((object) => { return object.id === id })[0])
      } else {
        return null
      }
    },
    async deleteBlog (id) {
      try {
        await this.$axios.delete(`/blog/${id}/`)
        this.getAllBlogs()
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

<style>
.blog_entry {
  border-left: 4px solid rgba(0, 0, 0, 0.4);
}
</style>
