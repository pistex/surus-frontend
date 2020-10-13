<template>
  <v-container id="blog">
    <v-row v-if="userData" justify="center">
      <v-col cols="10" class="pb-2 px-0" align="start">
        <v-btn dark to="/blog_create">
          Create
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-for="blog in allBlogs" :key="blog.id" justify="center">
      <v-col cols="10" class="grey darken-4">
        <v-card :to="blog.slug">
          <v-img
            :src="allImages.find((object) => object.id == blog.thumbnail).image"
            max-height="200px"
          />
          <v-card-title>
            {{ blog.title.en }}
          </v-card-title>
          <v-card-subtitle>
            <v-chip v-for="tag in blog.tag" :key="tag.en" x-small>
              {{ tag.text }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text class="hidden-xs-only">
            {{ blog.body.en.substring(0, 560) + ".." }}
          </v-card-text>
          <v-card-text class="hidden-sm-and-up">
            {{
              blog.body.en.substring(0, 170) + ".."
            }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async asyncData ({ store }) {
    await store.dispatch('blogStore/getBlogs')
    await store.dispatch('blogStore/getTags')
    await store.dispatch('blogStore/getImages')
    const allBlogs = await store.getters['blogStore/allBlogs']
    const allTags = await store.getters['blogStore/allTags']
    return { allBlogs, allTags }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('blogStore', ['allImages']),
    ...mapGetters('authenticationStore', ['userData'])
  },
  created () {
    if (process.browser) {
      this.truncateBlogBody()
    }
  },
  methods: {
    truncateBlogBody () {
      this.allBlogs.forEach((element) => {
        const rawHtml = element.body.en
        const tempDom = document.createElement('div')
        tempDom.innerHTML = rawHtml
        element.body.en = tempDom.textContent
      })
    }
  }
}
</script>

<style scoped>

</style>
