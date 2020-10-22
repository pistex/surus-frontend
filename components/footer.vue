<template>
  <v-container>
    <v-footer
      dark
      absolute
      padless
    >
      <v-container class="text-center">
        {{ new Date().getFullYear() }} -<span class="font-weight-light"> S U R U S</span>
      </v-container>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style>
</style>
