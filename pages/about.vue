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
  </v-container>
</template>

<script>
export default {

}
</script>

<style>
a {
  text-decoration: none;
}
</style>
