<template>
  <div id="adminPanel">
    <table v-if="groupsAreRetrived" id="groupsTabel" style="width: 100%">
      <tr>
        Add new group
        <input v-model="addGroupName" type="text" @keyup.enter="createGroup(addGroupName, [])">
        <button @click="createGroup(addGroupName, [])">
          Add
        </button>
      </tr>
      <tr>
        <th>id</th>
        <th>name</th>
      </tr>
      <tr v-for="(group, index) in allGroups" :key="index" class="groupEntry">
        <td>{{ group.id }}</td>
        <td>
          <input v-model="group.name" type="text"><button
            @click="
              updateGroup({
                id: group.id,
                group_name: group.name,
                permissions: [],
              })
            "
          >
            Save
          </button>
          <button
            @click="
              deleteGroup({
                id: group.id,
              })
            "
          >
            Delete
          </button>
        </td>
      </tr>
    </table>
    <table v-if="usersAreRetrived" id="usersTabel" style="width: 100%">
      <tr>
        <th>id</th>
        <th>fist_name</th>
        <th>last_name</th>
        <th>username</th>

        <th>email</th>
        <th>group</th>
        <th>is_superuser</th>
        <th>is_staff</th>
        <th>is_active</th>
        <th>date_joined</th>
        <th>last_login</th>
      </tr>
      <tr
        v-for="user in allUsers"
        :key="user.id"
        class="userEntry"
        @click="goToDetail(user.id)"
      >
        <td v-for="data in user" :key="data.id">
          {{ data }}
        </td>
        <td>
          <button @click="deleteUser(user.id)">
            Delete
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      usersAreRetrived: null,
      groupsAreRetrived: null,
      addGroupName: null
    }
  },
  computed: {
    ...mapGetters('adminPanel', ['allUsers', 'allGroups'])
  },
  mounted () {
    this.getAllUsers()
    this.getAllGroups()
  },
  methods: {
    async getAllUsers () {
      this.usersAreRetrived = true
      await this.$store.dispatch('adminPanel/getAllUsers')
    },
    async getAllGroups () {
      this.groupsAreRetrived = true
      await this.$store.dispatch('adminPanel/getAllGroups')
    },
    async goToDetail (id) {
      await this.$router.push(this.$route.path + '/user/' + id)
    },
    async createGroup (groupName, permissions) {
      await this.$store.dispatch('adminPanel/createGroup', { groupName, permissions })
      this.addGroupName = null
    },
    ...mapActions('adminPanel', ['deleteUser', 'updateGroup', 'deleteGroup'])
  }
}
</script>

<style scoped>
table,
th,
td {
  border: 1px solid black;
}
th {
  background: hotpink;
}
.userEntry {
  background: gray;
}
.userEntry:hover {
  background: blueviolet;
}
.groupEntry {
  background: gray;
}
.groupEntry:hover {
  background: blueviolet;
}
</style>
