<template>
  <v-container>
    <v-card v-if="!passwordIsReset" dark>
      <v-card-title>
        Please enter new password
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newPassword"
          label="password"
          type="password"
        />
        <v-text-field
          v-model="confirmNewPassword"
          label="confirm password"
          type="password"
        />
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn dark @click="resetPassword()">
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-container v-if="passwordIsReset" class="text-center text-h2 pt-8">
      Your password is reset.
    </v-container>
  </v-container>
</template>

<script>
import errorResponseAlert from '@/helpers/axios-request-error'
export default {
  data () {
    return {
      passwordIsReset: false,
      newPassword: '',
      confirmNewPassword: ''

    }
  },
  methods: {
    async resetPassword () {
      if (this.newPassword !== this.confirmNewPassword) {
        alert('password confirmation failed')
        return
      }
      const passwordRetData = {
        uid: this.$route.params.uid,
        token: this.$route.params.token,
        new_password1: this.newPassword,
        new_password2: this.confirmNewPassword
      }
      console.log(passwordRetData)
      try {
        await this.$axios.post('/authentication/password/reset/confirm/', passwordRetData)
        this.passwordIsReset = true
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  }
}
</script>
