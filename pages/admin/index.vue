<template>
  <div />
</template>
<script>
export default {
  beforeCreate () {
    if (!this.$auth.$state.loggedIn || (this.$auth.$state.user && !this.$auth.$state.user.is_superuser)) {
      this.$router.push('/')
    } else {
      this.$router.push('/admin/dashboard/')
    }
  }
}
</script>

<style>

</style>
