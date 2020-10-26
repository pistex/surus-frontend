<template>
  <v-container id="blog">
    <v-row justify="center">
      <v-col cols="10" class="pb-2 px-0" align="start">
        <v-btn v-if="$auth.loggedIn && $auth.user.groups.includes('Creator')" dark to="/blog/create">
          Create
        </v-btn>
        <v-btn dark @click="isPrimaryLangauge = !isPrimaryLangauge">
          {{ isPrimaryLangauge ? 'EN' : 'TH' }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-for="blog in allBlogs.filter((element, index) => {return index+1 >= 1+((page-1)*8) && index+1 <= page*8})" :key="blog.id" justify="center">
      <v-col cols="10" class="grey darken-4">
        <v-card>
          <v-img
            :src="allImages.find((object) => object.id == blog.thumbnail).image"
            max-height="200px"
          />
          <v-card-title>
            <a :href="`/blog/${blog.slug}`">{{ isPrimaryLangauge ? blog.title.en : blog.title.th }}</a>
          </v-card-title>
          <v-card-subtitle>
            <v-chip v-for="tag in blog.tag" :key="tag.text" x-small :to="`/blog/tag/${tag.text}`">
              {{ tag.text }}
            </v-chip>
          </v-card-subtitle>
          <v-card-text class="hidden-xs-only">
            {{ (isPrimaryLangauge ? blog.body.en.substring(0, 560) : blog.body.th.substring(0, 560)) + ".." }}
          </v-card-text>
          <v-card-text class="hidden-sm-and-up">
            {{ (isPrimaryLangauge ? blog.body.en.substring(0, 170) : blog.body.th.substring(0, 170)) + ".." }}
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
              :length="Math.ceil(allBlogs.length / 8)"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-container>
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
      page: 1,
      isPrimaryLangauge: true
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
        const rawHtmlTh = element.body.th
        const tempDom = document.createElement('div')
        const tempDomTh = document.createElement('div')
        tempDom.innerHTML = rawHtml
        tempDomTh.innerHTML = rawHtmlTh
        element.body.en = tempDom.textContent
        element.body.th = tempDomTh.textContent
      })
    }
  },
  head () {
    return { title: 'Blogs' }
  }
}
</script>

<style>
.v-card__title a{
  color: black;
  text-decoration: none;
}
</style>
