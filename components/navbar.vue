<template>
  <v-container id="navbar">
    <v-app-bar app dark>
      <v-toolbar-title class="mr-6 font-weight-light">
        S U R U S
      </v-toolbar-title>
      <v-toolbar-items
        v-for="menu in menuItems"
        :key="menu.title"
        class="hidden-xs-only"
        :to="menu.path"
      >
        <v-btn x-large :to="menu.path" text class="menu-btn">
          <v-icon left>
            {{ menu.icon }}
          </v-icon>
          {{ menu.title }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs" class="hidden-sm-and-up" v-on="on">
            Menu
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in menuItems"
            :key="menu.title"
            link
            :to="menu.path"
          >
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ menu.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-toolbar-items>
        <v-btn text width="50" @click="drawer = !drawer">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-container>
      <v-navigation-drawer v-model="drawer" app temporary right dark>
        <v-card v-if="!$auth.loggedIn" height="100%">
          <v-card-title> Login </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="loginForm.username"
                label="username or email"
              />
              <v-text-field
                v-model="loginForm.password"
                type="password"
                label="password"
              />
            </v-form>
            <v-card-actions class="justify-center">
              <v-btn
                text
                outlined
                color="success"
                @click="postLogin(loginForm)"
              >
                Login
              </v-btn>
              <v-btn
                text
                outlined
                color="info"
                @click="registerationFormIsActivated = true"
              >
                Registeration
              </v-btn>
            </v-card-actions>
            <v-card-subtitle class="pb-0 text-center">
              using social media account
            </v-card-subtitle>
            <v-card-actions class="justify-center">
              <v-btn icon @click="firebaseFacebookAuthentication()">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon @click="firebaseGoogleAuthentication()">
                <v-icon>mdi-google</v-icon>
              </v-btn>
            </v-card-actions>
            <v-card-actions class="justify-center">
              <v-btn text outlined x-small @click="passwordResetIsActivated = !passwordResetIsActivated; resetPasswordEmailIsSent = false;">
                reset password
              </v-btn>
            </v-card-actions>
            <v-container v-if="passwordResetIsActivated" class="text-center">
              <v-text-field v-model="resetPasswordEmail" label="email" />
              <v-btn text outlined x-small @click="postPasswordReset()">
                send email
              </v-btn>
            </v-container>
            <v-container v-if="resetPasswordEmailIsSent" class="text-center">
              Password reset process has been made. If you provided a corrected email address, the email is sent.
            </v-container>
          </v-card-text>
        </v-card>
        <v-card v-if="$auth.$state.user" height="100%">
          <v-card-title class="justify-center pb-0">
            <p class="text-h6">
              Welcome!
            </p>
          </v-card-title>
          <v-container class="pa-0 text-center">
            <v-avatar size="100">
              <v-img :src="$auth.$state.user.profile_picture" />
            </v-avatar>
          </v-container>
          <v-card-title class="justify-center py-0">
            <p class="text-h6">
              {{
                $auth.$state.user.first_name !== "" &&
                  $auth.$state.user.first_name !== ""
                  ? `${$auth.$state.user.first_name} ${$auth.$state.user.last_name}`
                  : $auth.$state.user.username
              }}
            </p>
          </v-card-title>
          <v-card-subtitle class="text-center py-0">
            <v-chip :color="($auth.$state.user.email.filter((email) => {return email.primary})[0].verified) ? 'success' : ''" x-small>
              {{ ($auth.$state.user.email.filter((email) => {return email.primary})[0].verified) ? 'verified' : 'not verified' }}
            </v-chip>
            <p>
              {{
                $auth.$state.user.email.filter((object) => {
                  return (object.primary === true);
                })[0].email
              }}
            </p>
          </v-card-subtitle>
          <v-card-text class="white--text text-center py-0">
            <p>
              {{
                $auth.$state.user.groups.includes("Creator")
                  ? "Let's writing something!"
                  : "Welcome to our community!"
              }}
            </p>
            <p v-if="!$auth.$state.user.groups.includes('Creator')">
              You can contact admin to become a creator.
            </p>
          </v-card-text>
          <v-dialog
            v-model="profileEditor"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar
                dark
              >
                <v-btn
                  icon
                  dark
                  @click="profileEditor = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title class="text-button">
                  Edit profile
                </v-toolbar-title>
                <v-spacer />

                <v-btn
                  color="success"
                  @click="saveProfile()"
                >
                  Save
                </v-btn>
              </v-toolbar>
              <v-row>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    Profile Picture
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container id="profile_picture_container">
                    <v-img :src="newUserProfile.profile_picture ? createObjectURL(newUserProfile.profile_picture) : $auth.user.profile_picture" max-width="100%" max-height="100%" />
                  </v-container>
                  <v-container>
                    <v-file-input
                      ref="imageFileField"
                      v-model="newUserProfile.profile_picture"
                      prepend-icon="mdi-image"
                      color="black"
                      hide-details="auto"
                      type="file"
                    />
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    username
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container>
                    <v-text-field
                      v-model="newUserProfile.username"
                      label="username"
                      color="black"
                      :append-icon="newUserProfile.username !== currentUserProfile.username ? 'mdi-undo-variant' : ''"
                      @click:append="newUserProfile.username = currentUserProfile.username"
                    />
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    first name
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container>
                    <v-text-field
                      v-model="newUserProfile.first_name"
                      label="first name"
                      color="black"
                      :append-icon="newUserProfile.first_name !== currentUserProfile.first_name ? 'mdi-undo-variant' : ''"
                      @click:append="newUserProfile.first_name = currentUserProfile.first_name"
                    />
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    last name
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container>
                    <v-text-field
                      v-model="newUserProfile.last_name"
                      label="last name"
                      color="black"
                      :append-icon="newUserProfile.last_name !== currentUserProfile.last_name ? 'mdi-undo-variant' : ''"
                      @click:append="newUserProfile.last_name = currentUserProfile.last_name"
                    />
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    password
                  </v-container>
                </v-col>
                <v-col v-if="$auth.user.password_is_set" :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container class="pb-0">
                    <v-text-field
                      v-model="updatePassword.old_password"
                      color="black"
                      type="password"
                      label="old password"
                    />
                    <v-text-field
                      v-model="updatePassword.new_password1"
                      color="black"
                      type="password"
                      label="new password"
                    />
                    <v-text-field
                      v-model="updatePassword.new_password2"
                      color="black"
                      type="password"
                      label="confirm password"
                    />
                  </v-container>
                  <v-container class="pt-0">
                    <v-btn small color="info" @click="changePassword()">
                      change
                    </v-btn>
                    <p>
                      <small>When the password is successfully changed, the user will be automatically logged out.</small>
                    </p>
                  </v-container>
                </v-col>
                <v-col v-else :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <v-container>
                    <p>
                      Your account is signed up by third party account. The account password has not been set. You can set your password using the following form.
                    </p>
                    <v-text-field
                      v-model="initializePsswordForm.new_password"
                      :disabled="userPasswordIsInitialized"
                      color="black"
                      type="password"
                      label="new password"
                    />
                    <v-text-field
                      v-model="initializePsswordForm.confirm_password"
                      :disabled="userPasswordIsInitialized"
                      color="black"
                      type="password"
                      label="confirm password"
                    />
                    <v-btn
                      :disabled="userPasswordIsInitialized"
                      color="info"
                      @click="initializePassword"
                    >
                      {{ userPasswordIsInitialized ? 'Password is set':'Set password' }}
                    </v-btn>
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    email
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="py-0">
                  <v-row v-for="email in newUserProfile.email" :key="`email_${email.id}`" class="buttom-border">
                    <v-col :cols="$vuetify.breakpoint.smAndDown ? 12 : 6">
                      <v-container fill-height>
                        {{ email.email }}
                        <v-chip class="ml-2" x-small :color="email.verified ? 'success': 'grey'">
                          {{ email.verified ? 'verified': 'not verified' }}
                        </v-chip>
                        <v-chip v-if="email.primary" class="ml-2" x-small color="info">
                          primary
                        </v-chip>
                      </v-container>
                    </v-col>
                    <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 3" py-0>
                      <v-container v-if="!email.primary" justify-center text-center>
                        <v-btn small color="error" @click="removeEmail(email.id)">
                          delete
                        </v-btn>
                      </v-container>
                    </v-col>
                    <v-col :cols="$vuetify.breakpoint.smAndDown ? 6 : 3" py-0>
                      <v-container v-if="!email.primary && email.verified" justify-center text-center>
                        <v-btn small color="info" @click="makeEmailPrimary(email.id)">
                          make primary
                        </v-btn>
                      </v-container>
                      <v-container v-if="!email.verified" justify-center text-center>
                        <v-btn small color="info" :disabled="verificationEmailIsSent" @click="resendEmail(email.id)">
                          resend verification email
                        </v-btn>
                      </v-container>
                    </v-col>
                  </v-row>
                  <v-row class="buttom-border">
                    <v-col cols="10" class="py-0">
                      <v-container>
                        <v-text-field
                          v-model="newEmail.email"
                          color="black"
                          label="new email"
                        />
                      </v-container>
                    </v-col>
                    <v-col cols="2" class="py-0">
                      <v-container justify-center text-center fill-height>
                        <v-btn small color="info" @click="addEmail()">
                          add
                        </v-btn>
                      </v-container>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 2" class="black white--text text-button">
                  <v-container
                    fill-height
                    justify-center
                  >
                    social media
                  </v-container>
                </v-col>
                <v-col :cols="$vuetify.breakpoint.smAndDown ? 12: 10" align="start" class="buttom-border">
                  <small>Click on the icon to connect.</small>
                  <v-container>
                    <v-btn icon @click="connectToFacebook()">
                      <v-icon :color="$auth.user.social.facebook ? 'success' : 'grey'">
                        mdi-facebook
                      </v-icon>
                    </v-btn>
                  </v-container>
                  <v-container>
                    <v-btn icon @click="connectToGoogle()">
                      <v-container>
                        <v-icon :color="$auth.user.social.google ? 'success' : 'grey'">
                          mdi-google
                        </v-icon>
                      </v-container>
                    </v-btn>
                  </v-container>
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>
          <v-card-actions class="justify-center">
            <v-btn text outlined color="info" @click="activateProfileEditor()">
              Edit profile
            </v-btn>
            <v-spacer />
            <v-btn text outlined color="error" @click="postLogout()">
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-navigation-drawer>
    </v-container>
    <v-dialog
      v-model="registerationFormIsActivated"
      persistent
      max-width="600px"
    >
      <v-card dark>
        <v-card-title>
          <span class="headline">Registeration</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="registerForm.email"
                  label="Email"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="registerForm.username"
                  label="Username"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="registerForm.password1"
                  label="Password"
                  type="password"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="registerForm.password2"
                  label="Comfirm password"
                  type="password"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            text
            @click="registerationFormIsActivated = false"
          >
            Close
          </v-btn>
          <v-btn text color="success" @click="postRegister()">
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import errorResponseAlert from '@/helpers/axios-request-error'
export default {
  name: 'Navbar',
  data () {
    return {
      drawer: false,
      resetPasswordEmail: '',
      registerationFormIsActivated: false,
      passwordResetIsActivated: false,
      resetPasswordEmailIsSent: false,
      profileEditor: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'mdi-home' },
        { title: 'Blog', path: '/blog/', icon: 'mdi-newspaper' },
        { title: 'About', path: '/about/', icon: 'mdi-information' }
      ],
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: null,
        email: null,
        password1: null,
        password2: null
      },
      currentUserProfile: {},
      newUserProfile: {},
      initializePsswordForm: {},
      userPasswordIsInitialized: false,
      updatePassword: {},
      newEmail: {},
      verificationEmailIsSent: false
    }
  },
  computed: {
    ...mapGetters('authenticationStore', ['authenticationStatus'])
  },
  methods: {
    ...mapActions('authenticationStore', ['postLogin', 'postLogout', 'firebaseFacebookAuthentication', 'firebaseGoogleAuthentication', 'firebaseFacebookConnect', 'firebaseGoogleConnect']),
    async postRegister () {
      if (!this.registerForm.user && !this.registerForm.email) {
        alert('Please fill required filed.')
      } else if (this.registerForm.password1 !== this.registerForm.password2) {
        alert('Password confirmation failed.')
      } else {
        this.registerationFormIsActivated = false
        try {
          await this.$axios.post(
            '/authentication/registration/',
            this.registerForm
          )
        } catch (error) {
          errorResponseAlert(error)
        }
        try {
          this.postLogin({
            username: this.registerForm.username,
            password: this.registerForm.password2
          })
        } catch (error) {
          alert('registeration completed')
        }
      }
    },
    async postPasswordReset () {
      try {
        await this.$axios.post('/authentication/password/reset/', { email: this.resetPasswordEmail })
        this.passwordResetIsActivated = false
        this.resetPasswordEmailIsSent = true
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async initializePassword () {
      if (this.$auth.user.password_is_set) {
        return
      }
      if (this.initializePsswordForm.new_password !== this.initializePsswordForm.confirm_password) {
        alert('Password comfirmation failed.')
      } else {
        try {
          await this.$axios.post('/authentication/password/initialize/', this.initializePsswordForm)
          this.userPasswordIsInitialized = true
        } catch (error) {
          errorResponseAlert(error)
        }
      }
    },
    async changePassword () {
      try {
        await this.$axios.post('authentication/password/change/', this.updatePassword)
        this.postLogout()
        this.profileEditor = false
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    createObjectURL (file) {
      return URL.createObjectURL(file)
    },
    activateProfileEditor () {
      this.profileEditor = true
      this.currentUserProfile = {
        username: this.$auth.user.username,
        first_name: this.$auth.user.first_name,
        last_name: this.$auth.user.last_name
      }
      this.newUserProfile = {
        ...this.currentUserProfile,
        profile_picture: null,
        email: this.$auth.user.email.sort((a, b) => { return a.primary ? -1 : 1 })
      }
    },
    async saveProfile () {
      if (!this.newUserProfile.profile_picture) { delete this.newUserProfile.profile_picture }
      delete this.newUserProfile.email
      const profileIsUpdate = JSON.stringify(this.newUserProfile) !== JSON.stringify(this.currentUserProfile)
      if (profileIsUpdate) {
        try {
          const formData = new FormData()
          formData.append('username', this.newUserProfile.username)
          formData.append('first_name', this.newUserProfile.first_name)
          formData.append('last_name', this.newUserProfile.last_name)
          formData.append('profile_picture', this.newUserProfile.profile_picture)
          await this.$axios.patch(`/user_profile/${this.$auth.user.id}/`, formData)
          await this.$auth.fetchUser()
        } catch (error) {
          errorResponseAlert(error)
        }
      }
      this.profileEditor = false
    },
    async makeEmailPrimary (emailId) {
      try {
        await this.$axios.patch(`/user_email/${emailId}/`, { id: emailId, primary: true })
        await this.$auth.fetchUser()
        this.newUserProfile.email = this.$auth.user.email.sort((a, b) => { return a.primary ? -1 : 1 })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async addEmail () {
      try {
        await this.$axios.post('/user_email/', this.newEmail)
        this.newEmail.email = ''
        await this.$auth.fetchUser()
        this.newUserProfile.email = this.$auth.user.email.sort((a, b) => { return a.primary ? -1 : 1 })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async removeEmail (emailId) {
      try {
        await this.$axios.delete(`/user_email/${emailId}/`)
        await this.$auth.fetchUser()
        this.newUserProfile.email = this.$auth.user.email.sort((a, b) => { return a.primary ? -1 : 1 })
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async resendEmail (emailId) {
      try {
        await this.$axios.post(`/resend_verification_email/${emailId}/`)
        this.verificationEmailIsSent = true
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async connectToFacebook () {
      if (this.$auth.user.social.facebook) {
        return
      }
      try {
        await this.firebaseFacebookConnect()
        await this.$auth.fetchUser()
      } catch (error) {
        errorResponseAlert(error)
      }
    },
    async connectToGoogle () {
      if (this.$auth.user.social.google) {
        return
      }
      try {
        await this.firebaseGoogleConnect()
        await this.$auth.fetchUser()
      } catch (error) {
        errorResponseAlert(error)
      }
    }
  }
}
</script>

<style scoped>
.menu-btn {
  width: 140px;
}
#profile_picture_container {
  width: 200px; height: 200px;
}
.buttom-border {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
