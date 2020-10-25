<template>
  <client-only>
    <v-container id="admin_panel_group">
      <adminNavbar />
      <v-sheet v-if="this.$auth.$state.user && this.$auth.$state.user.is_superuser">
        <v-card dark tile>
          <v-card-title>
            <v-row no-gutters>
              <v-col cols="12">
                Groups
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
        <v-card tile>
          <v-row no-gutters>
            <v-col cols="4">
              <v-card-subtitle class="black--text text-center text-button">
                Group name
              </v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="black--text text-center text-button">
                Members
              </v-card-subtitle>
            </v-col>
            <v-col cols="4">
              <v-card-subtitle class="black--text text-center text-button">
                Actions
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
        <v-card v-for="group in allGroups" :key="group.id" tile>
          <v-row no-gutters>
            <v-col cols="4" class="group_entry">
              <v-card-subtitle class="black--text">
                {{ group.name }}
              </v-card-subtitle>
            </v-col>
            <v-col cols="4" class="group_entry">
              <v-card-subtitle class="black--text">
                <template v-for="(user, index) in allUsers.filter((user) => {return user.groups.includes(group.name)})">
                  {{ allUsers.filter((user) => {return user.groups.includes(group.name)}).length == index+1 ? `${user.username}` : `${user.username},` }}
                </template>
              </v-card-subtitle>
            </v-col>
            <v-col cols="2" class="group_entry">
              <v-card-actions class="justify-center ">
                <v-dialog
                  v-model="groupEditorIsActivated[group.id]"
                  hide-overlay
                  max-width="800"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      @click="newGroupName = group.name; newMembers = allUsers.filter((user) => {return user.groups.includes(group.name)}).map(user => user.username);"
                    >
                      edit
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-text class="pb-0">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="newGroupName"
                            color="black"
                            label="group name"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-combobox
                            v-model="newMembers"
                            label="members"
                            color="black"
                            :items="allUsers.map(user => user.username)"
                            hide-selected
                            multiple
                            chips
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="px-4">
                      <v-btn
                        color="error"
                        @click="groupEditorIsActivated[group.id] = false"
                      >
                        close
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        color="success"
                        @click="updateGroupAndMembers(group.id)"
                      >
                        save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-actions>
            </v-col>
            <v-col cols="2">
              <v-card-actions class="justify-center">
                <v-btn color="error" @click="deleteGroup({id: group.id})">
                  delete
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-sheet>
      <v-container class="pl-0">
        <v-btn dark @click="groupCreator = true">
          Create
        </v-btn>
        <v-dialog
          v-model="groupCreator"
          hide-overlay
          max-width="800"
        >
          <v-card>
            <v-card-title>
              Create new group
            </v-card-title>
            <v-card-text class="py-0">
              <v-text-field
                v-model="newGroup"
                color="black"
                label="group name"
                @keyup.enter="postGroup({groupName: newGroup, permissions: []}); newGroup = null; groupCreator = false"
              />
            </v-card-text>
            <v-card-actions class="px-4">
              <v-spacer /><v-btn color="info" @click="postGroup({groupName: newGroup, permissions: []}); newGroup = null; groupCreator = false">
                create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-container>
  </client-only>
</template>

<script>
import adminNavbar from '@/components/admin-navbar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: { adminNavbar },
  data () {
    return {
      newGroupName: null,
      newMembers: null,
      groupEditorIsActivated: {},
      groupCreator: false,
      newGroup: null
    }
  },
  computed: {
    ...mapGetters('adminPanel', ['allUsers', 'allGroups'])
  },
  created () {
    this.getAllGroups()
    this.getAllUsers()
  },
  methods: {
    ...mapActions('adminPanel', ['getAllUsers', 'getAllGroups', 'postGroup', 'patchGroup', 'deleteGroup', 'updateUserGroups']),
    updateGroupAndMembers (id) {
      const oldGroupName = this.allGroups.filter((group) => { return group.id === id })[0].name
      const oldMembers = this.allUsers.filter((user) => { return user.groups.includes(oldGroupName) }).map(user => user.username)
      const nameIsChanged = (this.newGroupName !== oldGroupName)
      const newMembers = JSON.parse(JSON.stringify(this.newMembers)) // This is not necessary. I do this just to keep in mind that v-combobox return observed object.
      const membersAreChanged = (JSON.stringify(newMembers.sort()) !== JSON.stringify(oldMembers.sort()))
      if (membersAreChanged) {
        const toBeRemove = []
        const toBeAdded = []
        oldMembers.forEach((member) => {
          if (!newMembers.includes(member)) {
            toBeRemove.push(member)
          }
        })
        newMembers.forEach((member) => {
          if (!oldMembers.includes(member)) {
            toBeAdded.push(member)
          }
        })
        toBeRemove.forEach((member) => {
          const userId = this.allUsers.filter((user) => { return user.username === member })[0].id
          const userOldGroups = this.allUsers.filter((user) => { return user.username === member })[0].groups
          const userNewGroup = userOldGroups.filter((group) => { return group !== oldGroupName })
          this.updateUserGroups({ id: userId, groups: userNewGroup })
        })
        toBeAdded.forEach((member) => {
          const userId = this.allUsers.filter((user) => { return user.username === member })[0].id
          const userOldGroups = this.allUsers.filter((user) => { return user.username === member })[0].groups
          const userNewGroup = JSON.parse(JSON.stringify(userOldGroups))
          userNewGroup.push(oldGroupName)
          this.updateUserGroups({ id: userId, groups: userNewGroup })
        })
      }
      if (nameIsChanged) {
        this.patchGroup({ id, groupName: this.newGroupName, permissions: [] })
      }
      this.newMembers = null
      this.newGroupName = null
      this.groupEditorIsActivated[id] = false
    }
  },
  head () {
    return { title: 'Group' }
  }
}
</script>

<style>
.group_entry {
  border-left: 4px solid rgba(0, 0, 0, 0.4);
}
</style>
