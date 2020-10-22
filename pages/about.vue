<template>
  <v-container id="about">
    <v-container class="text-h1 text-center">
      Welcome to Surus
    </v-container>
    <p>
      <span class="text-h4">Surus </span>
      <span class="text-h5">is blog engine driven by <a href="https://www.djangoproject.com/">Django</a> in backend and <a href="https://nuxtjs.org/">Nuxt.js</a> on frontend using material UI by <a href="https://vuetifyjs.com">Vuetify</a>.
        The backend and frontend are communicating with REST API.
        It contains basic feature of blog engine including comment, reply, tag.
        Anonymous comment, reply features are also implemented with reCAPTCHA. The instantly switch bilingual blog content is implemented (English and Thai by default) by using v-show which means both languages are rendered when the page is load.
        Rich text editior is implemented using <a href="https://tiptap.dev">tiptap</a>.
        Role-Based-Access-Control is implemented on both backend and frontend (please report to me is you see any security hole).
        Third-party authentication is implemented by <a href="https://firebase.google.com/docs/auth">Firebase Authentication</a> on frontend and <a href="https://github.com/jazzband/dj-rest-auth">dj-rest-auth</a> on backend.</span>
    </p>
    <p><span class="text-h5">Surus is named after an elephant in Punic war which was believed to be the last war elephant of Hannibal Barca's army. <a href="https://en.wikipedia.org/wiki/Surus">See more</a></span></p>
    <p class="text-h4">
      Source code
    </p>
    <p class="text-h5">
      <a href="https://github.com/pistex/surus">https://github.com/pistex/surus</a>
    </p>
    <p class="text-h5">
      <a href="https://github.com/pistex/surus-frontend">https://github.com/pistex/surus-frontend</a>
    </p>
    <v-card dark>
      <v-card-title>
        Report issue
      </v-card-title>
      <v-card-text class="pb-0">
        <v-select
          v-model="issueCategory"
          :items="issueCategorySeletor"
          label="Category"
        />
        <v-text-field
          v-model="issueTitle"
          label="Topic"
          counter="200"
          maxlength="200"
        />
        <v-textarea
          v-model="issueBody"
          label="Detail"
          counter="1000"
          maxlength="1000"
        />
        <v-text-field
          v-if="!$auth.$state.loggedIn"
          v-model="reporterEmail"
          label="Email"
        />
      </v-card-text>
      <v-card-actions class="justify-center">
        <recaptcha />
        <v-btn @click="postIssue()">
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import errorResponseAlert from '@/helpers/axios-request-error'
export default {
  data () {
    return {
      issueReporterPopup: false,
      issueTitle: '',
      issueBody: '',
      issueCategory: '',
      issueCategorySeletor: ['Code', 'System', 'Typo', 'Etc'],
      reporterEmail: ''
    }
  },
  methods: {
    async postIssue () {
      if (!this.$auth.$state.loggedIn && this.reporterEmail === '') {
        alert('Please provide your contact.')
        return
      }
      if (this.issueTitle === '' || this.issueBody === '' || this.issueCategory === '') {
        alert('Please provide your issue detail.')
        return
      }
      let recaptchaToken = ''
      if (!this.$auth.$state.loggedIn) {
        try {
          recaptchaToken = await this.$recaptcha.getResponse()
        } catch (error) {
          alert('reCAPTCHA failed.')
          return
        }
      }
      const issuePost = {
        title: this.issueTitle,
        blog_id: this.blogId,
        body: this.reporterEmail === '' ? this.issueBody : `${this.issueBody} Contact: ${this.reporterEmail}`,
        category: this.issueCategory.toUpperCase(),
        recaptcha: recaptchaToken
      }
      try {
        const postRespone = await this.$axios.post('/issue/', issuePost)
        const issueElement = await this.$axios.get(`/issue/${postRespone.data.id}/`)
        alert(`Your is report ticket number is #${String(issueElement.data.id).padStart(4, '0')}. We will investigate the issue and contact you back as soon as possible.`)
        this.issueReporterPopup = false
        this.issueTitle = ''
        this.issueBody = ''
        this.issueCategory = ''
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  }
}
</script>

<style>
a {
  text-decoration: none;
}
</style>
