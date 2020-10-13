<template>
  <v-container id="blog_post">
    <v-row justify="center" no-gutters>
      <v-col cols="10" align="end" class="pb-2">
        <v-btn
          v-if="userData"
          dark
          class="mr-2"
          :to="'./edit'"
        >
          edit
        </v-btn>
        <v-dialog v-model="historyPopup" hide-overlay max-width="400">
          <v-card dark>
            <v-card-title class="pb-0">
              Select verstion
            </v-card-title>
            <v-card-text class="py-0 white--text">
              <v-select
                v-model="selectedBlogDate"
                class="py-0 my-0"
                :items="blogHistorySelector"
                solo
                :messages="
                  selectedBlogDate
                    ? blogHistory.find(
                      (object) => object.date == selectedBlogDate
                    ).reason
                    : 'Please select date'
                "
              />
            </v-card-text>
            <v-card-actions class="mx-4 pb-4">
              <v-btn small @click="changeVerison()">
                Select
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn
          v-if="blogIsEdited"
          id="history_button"
          dark
          class="mr-2"
          @click="historyPopup = true"
        >
          History
        </v-btn>
        <v-btn dark @click="isPrimaryLanguge = !isPrimaryLanguge">
          {{ isPrimaryLanguge ? "EN" : "TH" }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <client-only>
        <v-col v-show="isPrimaryLanguge" cols="10">
          <v-sheet>
            <v-card>
              <v-img
                dark
                height="200px"
                :src="blogThumbnail"
                gradient="to top right, rgba(0,0,0,.5), rgba(50,50,50,.5)"
                class="align-end title_background"
              >
                <v-card-title class="text-h4">
                  {{ blogTitle }}
                </v-card-title>
              </v-img>
              <v-card-text
                id="content_en"
                class="blog_body black--text"
                v-html="htmlBody"
              />
            </v-card>
          </v-sheet>
        </v-col>
        <v-col v-show="!isPrimaryLanguge" cols="10">
          <v-sheet>
            <v-card>
              <v-img
                dark
                height="200px"
                :src="blogThumbnail"
                gradient="to top right, rgba(0,0,0,.5), rgba(50,50,50,.5)"
                class="align-end title_background"
              >
                <v-card-title class="text-h4">
                  {{ blogTitleTh }}
                </v-card-title>
              </v-img>
              <v-card-text
                id="content_th"
                class="blog_body black--text"
                v-html="htmlBodyTh"
              />
            </v-card>
          </v-sheet>
        </v-col>
      </client-only>
      <v-col cols="6">
        <v-container class="text-button black white--text">
          Comment
        </v-container>
      </v-col>
      <v-col cols="4">
        <v-container
          class="text-button white--text indigo darken-4"
        >
          Facebook comment
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

import Axios from '../../../axios'
export default {
  async asyncData ({ store, params }) {
    let htmlBody = ''
    let blogTitle = ''
    let htmlBodyTh = ''
    let blogTitleTh = ''
    let blogThumbnail = ''
    let blogIsEdited = false
    const blogHistory = []
    const blogHistorySelector = []

    try {
      const filteredArticle = await Axios.get('/blog/?slug=' + params.slug)
      const blogData = await Axios.get('/blog/' + filteredArticle.data[0].id + '/')
      if (Object.keys(blogData.data.history).length > 1) {
        blogIsEdited = true
        Object.keys(blogData.data.history).forEach((element) => {
          blogHistorySelector.push(element)
          blogHistory.push({
            date: element,
            content_en: blogData.data.history[element].en,
            content_th: blogData.data.history[element].th,
            reason: blogData.data.history[element].history_change_reason
          })
        })
      }
      htmlBody = blogData.data.body.en
      htmlBodyTh = blogData.data.body.th
      blogTitle = blogData.data.title.en
      blogTitleTh = blogData.data.title.th
      await store.dispatch('blogStore/getImages')
      const allImages = await store.getters['blogStore/allImages']
      blogThumbnail = allImages.find(
        object => object.id === blogData.data.thumbnail
      ).image
      return { htmlBody, htmlBodyTh, blogTitle, blogTitleTh, blogThumbnail, blogIsEdited, blogHistory, blogHistorySelector }
    } catch (error) {
      console.log('get blog error')
      throw new Error(error)
    }
  },
  data () {
    return {
      isPrimaryLanguge: true,
      selectedBlogDate: null,
      historyPopup: false
    }
  },
  computed: {
    ...mapGetters('authenticationStore', ['userData'])
  },
  async created () {
  },
  updated () {
    // this.resizeImage('blog_body')
  },
  methods: {

    async getBlogComments () {

    },
    async resizeImage (classname) {
      await this.$store.dispatch('sleep', 400)
      const d = Array.from(document.getElementsByClassName(classname))
      d.forEach((d) => {
        const images = d.querySelectorAll('img')
        Array.from(images).forEach((element) => {
          element.width = 600
        })
      })
    },
    changeVerison () {
      document.getElementById('content_en').innerHTML = this.blogHistory.find(
        object => object.date === this.selectedBlogDate
      ).content_en
      document.getElementById('content_th').innerHTML = this.blogHistory.find(
        object => object.date === this.selectedBlogDate
      ).content_th
      document.getElementById('history_button').innerHTML =
        'Blog version: ' + this.selectedBlogDate
    }
  }
}
</script>

<style>
</style>
