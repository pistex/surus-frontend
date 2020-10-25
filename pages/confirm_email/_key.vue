<template>
  <client-only>
    <v-container v-if="statusChecked" class="text-center text-h4 pt-8">
      {{ emailIsVerified ? 'The email is verified. You can close this window.' : 'No verification is made. Please try again or report this issue to admin.' }}
    </v-container>
    <v-container v-else class="text-center text-h4 pt-8">
      Verifying...
    </v-container>
  </client-only>
</template>

<script>
export default {
  data () {
    return {
      emailIsVerified: false,
      statusChecked: false
    }
  },
  async created () {
    try {
      await this.$axios.post(`/confirm_email/${this.$route.params.key}/`)
      this.emailIsVerified = true
      this.statusChecked = true
    } catch (error) {
      this.emailIsVerified = false
      this.statusChecked = true
    }
  },
  head () {
    return { title: 'Email verification' }
  }
}
</script>

<style>

</style>
