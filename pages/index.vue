<template>
  <v-container id="home">
    <v-card dark>
      <v-card-title
        :class="$vuetify.breakpoint.smAndDown ? 'text-h4' : 'text-h2'"
      >
        {{ isPrimaryLanguage ? 'Featured articles': 'บทความแนะนำ' }}
        <v-spacer />
        <v-btn @click="isPrimaryLanguageBuffer = !isPrimaryLanguageBuffer">
          {{ isPrimaryLanguage ? 'EN': 'TH' }}
        </v-btn>
      </v-card-title>
      <v-carousel cycle hide-delimiters show-arrows-on-hover height="400">
        <v-carousel-item
          v-for="blog in allBlogs.filter((blog) => {
            return blog.is_featured;
          })"
          :key="blog.id"
          gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,1)"
          :to="`/blog/${blog.slug}/`"
          :src="
            allImages.length > 0
              ? allImages.find((object) => object.id == blog.thumbnail).image
              : ''
          "
        >
          <!-- set the condition allImages.length > 0 to prevent error. -->
          <v-container fill-height class="align-end headline">
            {{ isPrimaryLanguage ? blog.title.en : blog.title.th }}
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {},
  data () {
    return {
      isPrimaryLanguageBuffer: true
    }
  },
  computed: {
    isPrimaryLanguage () {
      return this.isPrimaryLanguageBuffer
    },
    ...mapGetters('blog', ['allBlogs', 'allImages'])
  },
  created () {
    this.getImages()
    this.getAllBlogs()
  },
  methods: {
    ...mapActions('blog', ['getAllBlogs', 'getImages'])
  },
  head () {
    return { title: 'Homepage' }
  }
}
</script>
