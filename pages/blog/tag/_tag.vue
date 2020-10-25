<template>
  <v-container v-if="allBlogs.filter(blog => {return blog.tag.map(tag => tag.text).includes($route.params.tag)}).length > 0" :id="`blog_tag_${$route.params.tag}`">
    <v-row justify="center">
      <v-col v-if="$auth.$state.loggedIn && $auth.$state.user.groups.includes('Creator')" cols="10" class="pb-2 px-0" align="start">
        <v-btn dark to="/blog/create">
          Create
        </v-btn>
      </v-col>
      <v-col cols="10" class="pb-4 px-0" align="start">
        <span class="text-h2" v-text="$route.params.tag" />
      </v-col>
    </v-row>
    <v-row v-for="blog in allBlogs.filter(blog => {return blog.tag.map(tag => tag.text).includes($route.params.tag)}).filter((blog, index) => {return index+1 >= 1+((page-1)*8) && index+1 <= page*8})" :key="blog.id" justify="center">
      <v-col cols="10" class="grey darken-4">
        <v-card>
          <v-img
            :src="allImages.find((object) => object.id == blog.thumbnail).image"
            max-height="200px"
          />
          <v-card-title>
            <a :href="`/blog/${blog.slug}`">{{ blog.title.en }}</a>
          </v-card-title>
          <v-card-subtitle>
            <v-chip v-for="tag in blog.tag" :key="tag.en" x-small :to="`/blog/tag/${tag.text}`">
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
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container class="max-width">
            <v-pagination
              v-model="page"
              dark
              color="black"
              class="my-4"
              :length="Math.ceil(allBlogs.filter(blog => {return blog.tag.map(tag => tag.text).includes($route.params.tag)}).length / 8)"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <v-container v-else class="text-center text-h2 pt-8">
    There is no article with this tag.
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async asyncData ({ store }) {
    await store.dispatch('blogStore/getAllBlogs')
    await store.dispatch('blogStore/getImages')
    const allBlogs = await store.getters['blogStore/allBlogs']
    return { allBlogs }
  },
  data () {
    return {
      page: 1
    }
  },
  computed: {
    ...mapGetters('blogStore', ['allImages'])
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
  },
  head () {
    return { title: this.$route.params.tag }
  }
}
</script>

<style>
.v-card__title a{
  color: black;
  text-decoration: none;
}
</style>
