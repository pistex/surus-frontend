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
        <v-btn x-large :to="menu.path" text class="menu-btn ">
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
          <v-list-item v-for="menu in menuItems" :key="menu.title" link :to="menu.path">
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
      <v-navigation-drawer
        v-model="drawer"
        app
        temporary
        right
        dark
      >
        <v-card v-if="!$auth.loggedIn" height="100%">
          <v-card-title>
            Login
          </v-card-title>
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
            <v-card-actions>
              <v-btn
                text
                outlined
                color="success"
                @click="postLogin(loginForm)"
              >
                Login
              </v-btn>
              <v-btn text outlined color="info" @click="registerationFormIsActivated = true">
                Registeration
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
        <v-card v-if="$auth.$state.loggedIn" height="100%">
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
            <p class="text-h4">
              {{ $auth.$state.user.first_name !== '' && $auth.$state.user.first_name !== '' ? `${$auth.$state.user.first_name} ${$auth.$state.user.first_name}` : $auth.$state.user.username }}
            </p>
          </v-card-title>
          <v-card-title class="justify-center py-0">
            <p class="text-h6">
              {{ $auth.$state.user.email.filter((object) => {return object.is_primary = true})[0].email }}
            </p>
          </v-card-title>
          <v-card-text class="white--text text-center py-0">
            <p>
              {{ $auth.$state.user.groups.includes('Creator') ? "Let's writing something!": "Welcome to our community!" }}
            </p>
            <p v-if="!$auth.$state.user.groups.includes('Creator')">
              You can contact admin to become a creator.
            </p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              text
              outlined
              color="info"
            >
              Edit profile
            </v-btn>
            <v-spacer />
            <v-btn
              text
              outlined
              color="error"
              @click="postLogout()"
            >
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
          <v-btn
            text
            color="success"
            @click="postRegister()"
          >
            Save
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
      registerationFormIsActivated: false,
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
      }
    }
  },
  computed: {
    ...mapGetters('authenticationStore', ['authenticationStatus'])
  },
  mounted () {
  },
  methods: {
    ...mapActions('authenticationStore', ['postLogin', 'postLogout']),
    async postRegister () {
      if (!this.registerForm.user && !this.registerForm.email) {
        alert('Please fill required filed.')
      } else if (this.registerForm.password1 !== this.registerForm.password2) {
        alert('Password confirmation failed.')
      } else {
        this.registerationFormIsActivated = false
        try {
          await this.$axios.post('/authentication/registration/', this.registerForm)
        } catch (error) {
          errorResponseAlert(error)
        }
        try {
          this.postLogin({ username: this.registerForm.username, password: this.registerForm.password2 })
        } catch (error) {
          alert('registeration completed')
        }
      }
    }
  }
}
</script>

<style scoped>
.menu-btn {
  width: 140px;
}
</style>
