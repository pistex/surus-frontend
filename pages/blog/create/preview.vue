<template>
  <client-only>
    <v-container id="blog_preview">
      <v-row justify="center" no-gutters>
        <v-col cols="10">
          <v-sheet>
            <v-card>
              <v-card-title class="headline">
                {{ blogTitle }}
              </v-card-title>
              <v-card-text
                id="content_en"
                class="black--text blog__content"
                v-html="rawHtml"
              />
            </v-card>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>
import { hljs } from '@/plugins/highlight.js'
export default {
  data () {
    return {
      rawHtml: '',
      rawHtmlTh: '',
      blogTitle: '',
      blogTitleTh: ''
    }
  },
  mounted () {
    this.blogTitle = localStorage.getItem('updatedTitle')
    this.blogTitleTh = localStorage.getItem('updatedTitleTh')
    this.rawHtml = localStorage.getItem('updatedContent')
    this.rawHtmlTh = localStorage.getItem('updatedContentTh')
  },
  updated () {
    hljs.initHighlighting.called = false
    hljs.initHighlighting()
  }
}
</script>
