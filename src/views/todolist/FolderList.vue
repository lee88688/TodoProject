<template>
  <v-layout column style="height: 100%;">
    <!--<v-flex shrink class="folder-list-menu-search py-1">-->
      <!--<v-icon class="folder-list-menu-icon">mdi-vuejs</v-icon>-->
      <!--<v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>-->
      <!--<v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>-->
      <!--<v-text-field solo clearable hide-details flat append-icon="mdi-folder-search"></v-text-field>-->
    <!--</v-flex>-->
    <v-toolbar flat dense dark color="#316b7c">
    <!--<v-toolbar flat dense dark color="primary">-->
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-0"><v-icon>mdi-plus</v-icon></v-btn>
      <v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>
      <v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>
      <v-btn icon class="ma-0"><v-icon>mdi-folder-search</v-icon></v-btn>
      <v-btn icon class="ma-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
      <!--<v-text-field solo clearable hide-details flat append-icon="mdi-folder-search"></v-text-field>-->
    </v-toolbar>
    <v-flex grow style="overflow: auto; height: 0;">
      <v-navigation-drawer :mini-variant.sync="mini">
        <v-divider></v-divider>
        <v-list dense class="pa-0">
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
            <v-list-tile-content>标星</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-calendar-today</v-icon></v-list-tile-action>
            <v-list-tile-content>今天</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
            <v-list-tile-content>本周</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple @click="" v-for="v in arr" :key="v">
            <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
            <v-list-tile-content>本周</v-list-tile-content>
            <v-list-tile-action>
              <span>v</span>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FolderList',
  data () {
    const arr = []
    for (let i = 0; i < 15; i++) {
      arr.push(i)
    }
    return {
      mini: false,
      arr
    }
  }
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
  /*background-color: #fff;*/
  /*border-right: 1px solid rgba(0,0,0,0.12);*/

  > div {
    flex: 0 0 auto;
  }
}
</style>
