<template>
  <client-only>
    <v-container class="text-center text-h4 pt-8">
      {{ emailIsVerified ? 'The email is verified. You can close this window.' : 'No verification is made. Please try again or report this issue to admin.' }}
    </v-container>
  </client-only>
</template>

<script>
import errorResponseAlert from '@/helpers/axios-request-error'
export default {
  data () {
    return {
      emailIsVerified: false
    }
  },
  async created () {
    try {
      await this.$axios.post(`/confirm_email/${this.$route.params.key}/`)
      this.emailIsVerified = true
    } catch (error) {
      errorResponseAlert(error)
    }
  }
}
</script>

<style>

</style>
