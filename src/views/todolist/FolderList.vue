<template>
  <v-layout column style="height: 100%;">
    <v-flex shrink class="folder-list-menu-search py-1">
      <v-icon class="folder-list-menu-icon">mdi-menu</v-icon>
      <v-text-field solo clearable hide-details flat append-icon="mdi-folder-search"></v-text-field>
    </v-flex>
    <v-flex grow>
      <v-layout column style="height: 100%;">
        <v-flex shrink class="folder-list-user-info">
          <v-menu>
            <template #activator="{ on }">
              <v-layout row align-center>
                <v-avatar>
                  <v-icon>mdi-vuejs</v-icon>
                </v-avatar>
                <span>lisi</span>
              </v-layout>
            </template>
          </v-menu>
        </v-flex>
        <v-flex grow>folder</v-flex>
        <v-flex shrink>add new folder</v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FolderList'
}
</script>

<style lang="scss" scoped>
.folder-list-menu-search {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.folder-list-menu-icon {
  padding: 10px 10px;
}

.folder-list-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
