<template>
  <div />
</template>
<script>
export default {
  beforeCreate () {
    if (!this.$auth.user.is_superuser) {
      this.$router.push('/')
    } else {
      this.$router.push('/admin/dashboard/')
    }
  },
  head () {
    return { title: 'Verifying' }
  }
}
</script>

<style>

</style>
