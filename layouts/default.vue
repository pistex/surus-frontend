<template>
  <v-app dark>
    <Navbar v-if="disableAdminPanel()" />
    <v-main class="pt-4 pb-8">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/navbar'
export default {
  components: {
    Navbar
  },
  methods: {
    disableAdminPanel () {
      return !this.$route.path.startsWith('/admin')
    }
  }
}
</script>

<style lang="scss">
.v-application code {
  all: unset !important;
}
.v-application p code {
  padding: 0.2rem 0.4rem !important;
  border-radius: 5px !important;
  font-size: 0.8rem !important;
  font-weight: 700 !important;
  background: rgba(0, 0, 0, 0.1) !important;
  color: rgba(0, 0, 0, 0.8) !important;
}
.v-application pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  overflow-x: auto;
}
.editor__content blockquote, .blog__content blockquote{
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}
.editor__content blockquote p, .blog__content blockquote p{
  margin: 0;
}
.editor__content img, .blog__content img{
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.ProseMirror {
  height: 400px;
  overflow: auto;
}
pre {
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>
