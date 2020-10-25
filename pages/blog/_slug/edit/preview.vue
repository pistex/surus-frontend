<template>
  <client-only>
    <v-container id="blog_create_preview">
      <v-row justify="center" no-gutters>
        <v-col cols="10" align="end">
          <v-btn
            dark
            @click="
              isPrimaryLanguage = !isPrimaryLanguage;
            "
          >
            {{ isPrimaryLanguage ? "EN" : "TH" }}
          </v-btn>
        </v-col>
        <v-col cols="10">
          <v-sheet>
            <v-card>
              <v-card-title class="headline">
                {{ isPrimaryLanguage ? blogTitle : blogTitleTh }}
              </v-card-title>
              <v-card-text
                v-if="isPrimaryLanguage"
                id="content_en"
                class="black--text blog__content"
                v-html="rawHtml"
              />
              <v-card-text
                v-if="!isPrimaryLanguage"
                id="content_en"
                class="black--text blog__content"
                v-html="rawHtmlTh"
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
      isPrimaryLanguage: true,
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
  },
  head () {
    return { title: 'Blog preview' }
  }
}
</script>
