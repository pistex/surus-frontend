<template>
  <v-container id="blog_post">
    <v-row justify="center" no-gutters>
      <v-col cols="10" align="end" class="pb-2">
        <v-btn
          v-if="$auth.$state.loggedIn && $auth.$state.user.username === blogAuthor.username"
          dark
          class="mr-2"
          :to="`/blog/${$route.params.slug}/edit`"
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
      <v-col v-show="isPrimaryLanguge" cols="10">
        <v-sheet>
          <v-card>
            <v-img
              dark
              height="200px"
              :src="blogThumbnail"
              gradient="to top right, rgba(0,0,0,.5), rgba(50,50,50,.5)"
              class="align-end"
            >
              <v-card-title class="text-h4">
                {{ blogTitle }}
              </v-card-title>
            </v-img>
            <v-card-text
              id="content_en"
              class="black--text blog__content"
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
              class="align-end"
            />
            <v-card-title class="text-h4">
              {{ blogTitleTh }}
            </v-card-title>
            <v-card-text
              id="content_th"
              class="black--text blog__content"
              v-html="htmlBodyTh"
            />
          </v-card>
        </v-sheet>
      </v-col>
      <v-col cols="6">
        <v-container class="text-button black white--text">
          Comment
        </v-container>
        <v-container>
          <v-card v-for="comment in allComments" :key="`comment_${comment.id}`" class="mb-4">
            <!-- {{ comment }} -->
            <v-card-actions class="justify-end pb-0">
              <v-btn v-if="comment.user && comment.user.username === $auth.$state.user.username" x-small text @click="activateCommentEditior(comment.id)">
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn v-if="comment.user && comment.user.username === $auth.$state.user.username" x-small text>
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-title v-if="comment.user" class="py-0 black--text">
              <v-avatar
                class="mr-2"
              >
                <v-img :src="comment.user.profile_picture" />
              </v-avatar>
              {{ comment.user.first_name !== '' && comment.user.last_name !== '' ? `${comment.user.first_name} ${comment.user.last_name}` : comment.user.username }}
            </v-card-title>

            <v-card-title v-if="!comment.user" class="py-0 black--text">
              <v-avatar
                class="mr-2"
              >
                <v-img :src="`${$axios.defaults.baseURL}/media/default_profile_picture.png`" />
              </v-avatar>
              anonymous
            </v-card-title>
            <v-card-text :id="`comment_${comment.id}`" class="pt-2 black--text">
              {{ comment.body }}
            </v-card-text>
            <v-card-text :id="`comment_editor_${comment.id}`" style="display: none;" class="pt-2 black--text">
              <v-text-field v-model="editingComment" color="black" @keyup.enter="patchComment(comment.id)" />
            </v-card-text>
          </v-card>
          <v-card>
            <v-textarea color="black" hide-details="auto" counter="200" class="pa-2" />
            <v-card-actions class="justify-end">
              <v-btn dark>
                comment
              </v-btn>
            </v-card-actions>
          </v-card>
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

export default {
  async asyncData ({ $axios, store, params }) {
    let htmlBody = ''
    let blogId = 0
    let blogTitle = ''
    let htmlBodyTh = ''
    let blogTitleTh = ''
    let blogThumbnail = ''
    let blogAuthor = {
      username: '',
      first_name: '',
      last_name: ''
    }
    let blogIsEdited = false
    const blogHistory = []
    const blogHistorySelector = []

    try {
      const filteredArticle = await $axios.get(`/blog/?slug=${params.slug}`)
      blogId = filteredArticle.data[0].id
      const blogData = await $axios.get(`/blog/${blogId}/`)
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
      blogAuthor = {
        username: blogData.data.author.username,
        first_name: blogData.data.author.first_name,
        last_name: blogData.data.author.last_name
      }
      await store.dispatch('blogStore/getImages')
      const allImages = await store.getters['blogStore/allImages']
      blogThumbnail = allImages.find(
        object => object.id === blogData.data.thumbnail
      ).image
      const commentData = await $axios.get(`/comment/?blog=${filteredArticle.data[0].id}`)
      const allComments = commentData.data
      return { htmlBody, htmlBodyTh, blogTitle, blogTitleTh, blogThumbnail, blogIsEdited, blogHistory, blogHistorySelector, blogAuthor, allComments }
    } catch (error) {
      throw new Error(error)
    }
  },
  data () {
    return {
      isPrimaryLanguge: true,
      selectedBlogDate: null,
      historyPopup: false,
      editingComment: '',
      editingReason: '',
      currentComment: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.resizeImage('blog__content')
  },
  updated () {
    this.resizeImage('blog__content')
  },
  methods: {
    activateCommentEditior (id) {
      this.editingComment = this.allComments.find(object => object.id === id).body.trim()
      const commentElement = document.getElementById(`comment_${id}`)
      const commentEditor = document.getElementById(`comment_editor_${id}`)
      if (commentElement.style.display === '' && commentEditor.style.display === 'none') {
        commentElement.style.display = 'none'
        commentEditor.style.display = ''
      } else {
        commentElement.style.display = ''
        commentEditor.style.display = 'none'
      }
    },
    async patchComment (id) {
      this.currentComment = this.allComments.find(object => object.id === id).body.trim()
      const commentElement = document.getElementById(`comment_${id}`)
      const commentEditor = document.getElementById(`comment_editor_${id}`)
      if (this.editingComment === this.currentComment) {
        commentElement.style.display = ''
        commentEditor.style.display = 'none'
        return
      }
      const commentPatch = {
        body: this.editingComment,
        blog_id: this.blogId,
        reason: this.editingReason !== '' ? this.editingReason : 'no reason'
      }
      try {
        await this.$axios.patch(`/comment/${id}/`, commentPatch)
      } catch (error) {
        throw new Error(error)
      }
      commentElement.innerHTML = this.editingComment
      commentElement.style.display = ''
      commentEditor.style.display = 'none'
    },
    resizeImage (classname) {
      const d = Array.from(document.getElementsByClassName(classname))
      d.forEach((d) => {
        const images = d.querySelectorAll('img')
        Array.from(images).forEach((element) => {
          element.width = 600
          element.class = 'center_image'
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
      this.resizeImage('blog__content')
    }
  }
}
</script>

<style >
</style>
