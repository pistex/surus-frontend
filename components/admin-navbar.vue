<template>
  <client-only>
    <v-container v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser" id="admin_navbar" class=" py-0">
      <v-navigation-drawer
        app
        dark
        permanent
      >
        <v-list>
          <v-list-item
            v-for="([icon, text, link], i) in menuItems"
            :key="i"
            :to="link"
          >
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-container>
  </client-only>
</template>

<script>
import smallScreenWarning from '@/helpers/not-optimized-for-small-device'
export default {
  name: 'AdminNavbar',
  data () {
    return {
      menuItems: [
        ['mdi-view-dashboard', 'Dashboard', '/admin/dashboard/'],
        ['mdi-newspaper-variant', 'Blog', '/admin/blog/'],
        ['mdi-account-edit', 'User Management', '/admin/user/'],
        ['mdi-account-group', 'Group', '/admin/group/']
      ]
    }
  },
  beforeCreate () {
    if (!this.$auth.loggedIn || !this.$auth.user.is_superuser) {
      this.$router.push('/')
    }
  },
  created () {
    if (this.$vuetify.breakpoint.smAndDown) {
      smallScreenWarning()
    }
  }
}
</script>

<style>
</style>
