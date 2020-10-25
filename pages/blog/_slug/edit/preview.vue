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
    this.blogTitle = localStorage.getItem('previewTitle')
    this.blogTitleTh = localStorage.getItem('previewTitleTh')
    this.rawHtml = localStorage.getItem('previewContent')
    this.rawHtmlTh = localStorage.getItem('previewContentTh')
  },
  updated () {
    hljs.initHighlighting.called = false
    hljs.initHighlighting()
  }
}
</script>
