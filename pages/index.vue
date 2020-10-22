<template>
  <v-container id="home">
    <v-card dark>
      <v-card-title :class="$vuetify.breakpoint.smAndDown ? 'text-h4' : 'text-h2'">
        Featured articles
      </v-card-title>
      <v-carousel cycle hide-delimiters show-arrows-on-hover height="400">
        <v-carousel-item
          v-for="blog in allBlogs.filter(blog => {return blog.is_featured})"
          :key="blog.id"
          gradient="to top right, rgba(0,0,0,.4), rgba(0,0,0,1)"
          :to="`/blog/${blog.slug}/`"
          :src="allImages.find((object) => object.id == blog.thumbnail).image"
        >
          <v-container
            fill-height
            class="align-end headline"
          >
            {{ blog.title.en }}
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
  },
  computed: {
    ...mapGetters('blogStore', ['allBlogs', 'allImages'])
  },
  created () {
    this.getAllBlogs()
    this.getImages()
  },
  methods: {
    ...mapActions('blogStore', ['getAllBlogs', 'getImages'])
  }
}
</script>
