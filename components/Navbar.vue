<template>
  <v-container id="navbar">
    <v-app-bar app dark>
      <v-toolbar-title class="mr-6">
        VUETIFY SANDBOX
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
          <v-list-item v-for="menu in menuItems" :key="menu.title" link>
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
      <v-navigation-drawer v-model="drawer" absolute temporary right dark>
        <v-card v-if="!status.loggedIn" height="100%">
          <v-card-title primary-title>
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
              <v-btn text outlined color="info">
                Registeration
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
        <v-card v-if="status.loggedIn" height="100%">
          <v-card-title primary-title>
            Hello, {{ userData.username }}.
          </v-card-title>
          <v-card-actions>
            <v-btn
              text
              outlined
              color="success"
              @click="postLogout()"
            >
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-navigation-drawer>
    </v-container>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Navbar',
  data () {
    return {
      drawer: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'mdi-home' },
        { title: 'Blog', path: '/blog/', icon: 'mdi-newspaper' },
        { title: 'About', path: '/about/', icon: 'mdi-information' }
      ],
      loginForm: {
        username: '',
        password: ''
      },
      emailPasswordReset: ''
    }
  },
  computed: {
    ...mapGetters('authenticationStore', ['status', 'userData'])
  },
  methods: {
    ...mapActions('authenticationStore', ['postLogin', 'postLogout'])
  }
}
</script>

<style scoped>
.menu-btn {
  width: 140px;
}
</style>
