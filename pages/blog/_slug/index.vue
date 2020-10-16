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
              gradient="to top right, rgba(0,0,0,.8), rgba(0,0,0,1)"
              class="align-end"
            >
              <v-card-title class="text-h4">
                {{ blogTitle }}
              </v-card-title>
              <v-card-subtitle class="white--text">
                <v-icon>mdi-account</v-icon> Creator : {{ blogAuthor.first_name !== '' && blogAuthor.last_name !== '' ? `${blogAuthor.first_name} ${blogAuthor.last_name}` : blogAuthor.username }} <v-icon>mdi-calendar</v-icon> Created: {{ blogHistorySelector[0] }} <v-icon v-if="blogIsEdited">
                  mdi-calendar-edit
                </v-icon> {{ blogIsEdited ? `Last modified: ${blogHistorySelector[blogHistorySelector.length -1]}` : '' }}
              </v-card-subtitle>
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
              gradient="to top right, rgba(0,0,0,.8), rgba(0,0,0,1)"
              class="align-end"
            >
              <v-card-title class="text-h4">
                {{ blogTitleTh }}
              </v-card-title>
              <v-card-subtitle class="white--text">
                <v-icon>mdi-account</v-icon> ผู้เขียน : {{ blogAuthor.first_name !== '' && blogAuthor.last_name !== '' ? `${blogAuthor.first_name} ${blogAuthor.last_name}` : blogAuthor.username }} <v-icon>mdi-calendar</v-icon> วันที่สร้าง: {{ blogHistorySelector[0] }} <v-icon v-if="blogIsEdited">
                  mdi-calendar-edit
                </v-icon> {{ blogIsEdited ? `แก้ไขล่าสุด: ${blogHistorySelector[blogHistorySelector.length -1]}` : '' }}
              </v-card-subtitle>
            </v-img>
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
            <v-card-actions class="justify-end pb-0">
              <v-btn v-if="($auth.$state.user && $auth.$state.user.is_superuser) || (comment.user && $auth.$state.user && comment.user.username === $auth.$state.user.username)" x-small text @click="activateCommentEditior(comment.id)">
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn v-if="($auth.$state.user && $auth.$state.user.is_superuser) || (comment.user && $auth.$state.user && comment.user.username === $auth.$state.user.username)" x-small text @click="deleteComment(comment.id)">
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>
              <v-dialog
                hide-overlay
                dark
                max-width="800"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-if="Object.keys(comment.history).length > 1"
                    x-small
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon small>
                      mdi-history
                    </v-icon>
                  </v-btn>
                </template>
                <v-card v-for="date in Object.keys(comment.history)" :key="date" class="pa-2">
                  <v-card-title class="white--text">
                    {{ date }}
                  </v-card-title>
                  <v-card-subtitle class="pb-2 white--text">
                    Editing reason: {{ comment.history[date].reason }}
                  </v-card-subtitle>
                  <v-card-text class="white--text">
                    {{ comment.history[date].body }}
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-card-actions>
            <v-card-title class="black--text pt-0">
              <v-avatar
                class="mr-2"
              >
                <v-img :src="comment.user ? comment.user.profile_picture : `${$axios.defaults.baseURL}/media/default_profile_picture.png`" />
              </v-avatar>
              {{ comment.user ? (comment.user.first_name !== '' && comment.user.last_name !== '' ? `${comment.user.first_name} ${comment.user.last_name}` : comment.user.username) : 'Anonymous' }}
            </v-card-title>
            <v-card-subtitle class="black--text py-0">
              <small>{{ `Created: ${Object.keys(comment.history)[Object.keys(comment.history).length - 1]} Last modified: ${Object.keys(comment.history)[0]}` }}</small>
            </v-card-subtitle>
            <v-card-text :id="`comment_${comment.id}`" class="pt-2 black--text">
              {{ comment.body }}
            </v-card-text>
            <v-card-text :id="`comment_editor_${comment.id}`" style="display: none;" class="pt-2 black--text">
              <v-textarea
                v-model="editingComment"
                label="Comment"
                counter="1000"
                maxlength="1000"
                color="black"
                @keyup.enter="patchComment(comment.id)"
              />
              <v-text-field
                v-model="editingReason"
                label="Editing reason"
                counter="100"
                maxlength="100"
                color="black"
                @keyup.enter="patchComment(comment.id)"
              />
            </v-card-text>
            <v-card v-for="reply in allReplies.filter((object) => {return object.comment.id == comment.id})" :key="`reply_${reply.id}`" flat outlined class="ml-8 mr-4 mb-2">
              <v-card-actions class="justify-end pb-0">
                <v-btn v-if="($auth.$state.user && $auth.$state.user.is_superuser) || (reply.user && $auth.$state.user && reply.user.username === $auth.$state.user.username)" x-small text @click="activateReplyEditor(reply.id)">
                  <v-icon small>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn v-if="($auth.$state.user && $auth.$state.user.is_superuser) || (comment.user && $auth.$state.user && comment.user.username === $auth.$state.user.username)" x-small text @click="deleteReply(reply.id)">
                  <v-icon small>
                    mdi-delete
                  </v-icon>
                </v-btn>
                <v-dialog
                  hide-overlay
                  dark
                  max-width="800"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="Object.keys(reply.history).length > 1"
                      x-small
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>
                        mdi-history
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card v-for="date in Object.keys(reply.history)" :key="date" class="pa-2">
                    <v-card-title class="white--text">
                      {{ date }}
                    </v-card-title>
                    <v-card-subtitle class="pb-2 white--text">
                      Editing reason: {{ reply.history[date].reason }}
                    </v-card-subtitle>
                    <v-card-text class="white--text">
                      {{ reply.history[date].body }}
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-card-actions>
              <v-card-title class="black--text pt-0">
                <v-avatar
                  class="mr-2"
                >
                  <v-img :src="reply.user ? reply.user.profile_picture : `${$axios.defaults.baseURL}/media/default_profile_picture.png`" />
                </v-avatar>
                {{ reply.user ? (reply.user.first_name !== '' && reply.user.last_name !== '' ? `${reply.user.first_name} ${reply.user.last_name}` : reply.user.username) : 'Anonymous' }}
              </v-card-title>
              <v-card-subtitle class="black--text py-0">
                <small>{{ `Created: ${Object.keys(reply.history)[Object.keys(reply.history).length - 1]} Last modified: ${Object.keys(reply.history)[0]}` }}</small>
              </v-card-subtitle>
              <v-card-text :id="`reply_${reply.id}`" class="black--text">
                {{ reply.body }}
              </v-card-text>
              <v-card-text :id="`reply_editor_${reply.id}`" style="display: none;" class="pt-2 black--text">
                <v-textarea
                  v-model="editingReply"
                  label="Comment"
                  counter="1000"
                  maxlength="1000"
                  color="black"
                  @keyup.enter="patchReply(reply.id)"
                />
                <v-text-field
                  v-model="editingReason"
                  label="Editing reason"
                  counter="100"
                  maxlength="100"
                  color="black"
                  @keyup.enter="patchReply(reply.id)"
                />
              </v-card-text>
            </v-card>
            <v-card-actions>
              <v-spacer />
              <v-btn x-small dark @click="activateCommentReplier(comment.id)">
                reply
              </v-btn>
            </v-card-actions>
            <v-container :id="`comment_replier_${comment.id}`" style="display: none;">
              <v-card-text class="pt-2 black--text">
                <v-textarea
                  v-model="newReply"
                  label="Reply"
                  counter="1000"
                  maxlength="1000"
                  color="black"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn dark @click="postReply(reply.id)">
                  Reply
                </v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
          <v-card>
            <v-textarea
              v-model="newComment"
              color="black"
              hide-details="auto"
              counter="1000"
              class="pa-2"
              maxlength="1000"
            />
            <v-card-actions class="justify-end">
              <recaptcha />
              <v-btn dark @click="postComment()">
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
import errorResponseAlert from '@/helpers/axios-request-error'
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
      }
      Object.keys(blogData.data.history).forEach((element) => {
        blogHistorySelector.push(element)
        blogHistory.push({
          date: element,
          content_en: blogData.data.history[element].en,
          content_th: blogData.data.history[element].th,
          reason: blogData.data.history[element].history_change_reason
        })
      })
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
      const commentData = await $axios.get(`/comment/?blog=${blogId}`)
      const allComments = []
      const allReplies = []
      if (commentData.data.length !== 0) {
        commentData.data.forEach(async (comment) => {
          const commentElement = await $axios.get(`/comment/${comment.id}/`)
          allComments.push(commentElement.data)
          const replyData = await $axios.get(`/reply/?comment=${comment.id}`)
          if (replyData.data.length !== 0) {
            replyData.data.forEach(async (reply) => {
              const replyElement = await $axios.get(`/reply/${reply.id}/`)
              allReplies.push(replyElement.data)
            })
          }
        })
      }
      return { htmlBody, htmlBodyTh, blogId, blogTitle, blogTitleTh, blogThumbnail, blogIsEdited, blogHistory, blogHistorySelector, blogAuthor, allComments, allReplies }
    } catch (error) {
      errorResponseAlert(error)
      throw new Error(error)
    }
  },
  data () {
    return {
      isPrimaryLanguge: true,
      selectedBlogDate: null,
      historyPopup: false,
      editingComment: '',
      currentComment: '',
      editingReply: '',
      currentReply: '',
      editingReason: '',
      newComment: '',
      newReply: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.resizeImage('blog__content')
    this.refreshCommentAndReply()
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
    activateCommentReplier (id) {
      const commentReplier = document.getElementById(`comment_replier_${id}`)
      if (commentReplier.style.display === '') {
        commentReplier.style.display = 'none'
      } else {
        commentReplier.style.display = ''
      }
    },
    activateReplyEditor (id) {
      this.editingReply = this.allReplies.find(object => object.id === id).body.trim()
      const replyElement = document.getElementById(`reply_${id}`)
      const replyEditor = document.getElementById(`reply_editor_${id}`)
      if (replyElement.style.display === '') {
        replyElement.style.display = 'none'
        replyEditor.style.display = ''
      } else {
        replyElement.style.display = ''
        replyEditor.style.display = 'none'
      }
    },
    async refreshCommentAndReply () {
      this.allComments = []
      this.allReplies = []
      const commentData = await this.$axios.get(`/comment/?blog=${this.blogId}`)
      if (commentData.data.length !== 0) {
        commentData.data.forEach(async (comment) => {
          const commentElement = await this.$axios.get(`/comment/${comment.id}/`)
          this.allComments.push(commentElement.data)
          const replyData = await this.$axios.get(`/reply/?comment=${comment.id}`)
          if (replyData.data.length !== 0) {
            replyData.data.forEach(async (reply) => {
              const replyElement = await this.$axios.get(`/reply/${reply.id}/`)
              this.allReplies.push(replyElement.data)
            })
          }
        })
      }
    },
    async postComment () {
      if (!this.$auth.$state.loggedIn) {
        try {
          await this.$recaptcha.getResponse()
          await this.$recaptcha.reset()
        } catch (error) {
          alert('reCAPTCHA failed.')
        }
      }
      const commentPost = {
        body: this.newComment,
        blog_id: this.blogId
      }

      try {
        const postRespone = await this.$axios.post('/comment/', commentPost)
        const commentElement = await this.$axios.get(`/comment/${postRespone.data.id}/`)
        this.allComments.push(commentElement.data)
        this.newComment = ''
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async patchComment (id) {
      this.currentComment = this.allComments.find(object => object.id === id).body.trim()
      const commentElement = document.getElementById(`comment_${id}`)
      const commentEditor = document.getElementById(`comment_editor_${id}`)
      if (this.editingComment === this.currentComment) {
        this.activateCommentEditior(id)
      } else {
        const commentPatch = {
          body: this.editingComment,
          reason: this.editingReason !== '' ? this.editingReason : 'no reason'
        }
        try {
          await this.$axios.patch(`/comment/${id}/`, commentPatch)
          commentElement.innerHTML = this.editingComment
          commentElement.style.display = ''
          commentEditor.style.display = 'none'
          this.refreshCommentAndReply()
        } catch (error) {
          errorResponseAlert(error)
          commentElement.style.display = ''
          commentEditor.style.display = 'none'
        }
      }
    },
    async deleteComment (id) {
      try {
        await this.$axios.delete(`/comment/${id}/`)
        this.allComments = this.allComments.filter((object) => { return object.id !== id })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async postReply (replyId) {
      if (!this.$auth.$state.loggedIn) {
        try {
          await this.$recaptcha.getResponse()
          await this.$recaptcha.reset()
        } catch (error) {
          alert('reCAPTCHA failed.')
        }
      }
      const replyPost = {
        body: this.newReply,
        comment_id: replyId
      }

      try {
        const postRespone = await this.$axios.post('/reply/', replyPost)
        const replyElement = await this.$axios.get(`/reply/${postRespone.data.id}/`)
        this.allReplies.push(replyElement.data)
        this.newReply = ''
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async patchReply (id) {
      this.currentReply = this.allReplies.find(object => object.id === id).body.trim()
      const replyElement = document.getElementById(`reply_${id}`)
      const replyEditor = document.getElementById(`reply_editor_${id}`)
      if (this.editingReply === this.currentReply) {
        replyElement.style.display = ''
        replyEditor.style.display = 'none'
        this.refreshCommentAndReply()
      } else {
        const replyPatch = {
          body: this.editingReply,
          reason: this.editingReason !== '' ? this.editingReason : 'no reason'
        }
        try {
          await this.$axios.patch(`/reply/${id}/`, replyPatch)
          replyElement.style.display = ''
          replyEditor.style.display = 'none'
          this.refreshCommentAndReply()
        } catch (error) {
          errorResponseAlert(error)
          replyElement.style.display = ''
          replyEditor.style.display = 'none'
        }
      }
    },
    async deleteReply (id) {
      try {
        await this.$axios.delete(`/reply/${id}/`)
        this.allReplies = this.allReplies.filter((object) => { return object.id !== id })
      } catch (error) {
        errorResponseAlert(error)
      }
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
