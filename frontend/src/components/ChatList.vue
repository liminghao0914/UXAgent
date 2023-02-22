<template>
  <v-col
    cols="12"
    sm="3"
    class="flex-grow-1 flex-shrink-0"
    style="border-right: 1px solid #0000001f"
  >
    <v-responsive class="overflow-y-auto fill-height" height="760">
      <v-list subheader>
        <v-list-item-group v-model="activeChat">
          <template v-for="(item, index) in parents">
            <v-list-item :key="`parent${index}`" :value="item.id" @click="selectThread(item)">
                <v-badge
                  :content="item.count"
                  :value="item.count"
                  color="red"
                >
                  <v-icon> mdi-message </v-icon>
                </v-badge>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
                <v-list-item-subtitle v-text="item.content" />
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="`chatDivider${index}`" class="my-0" />
          </template>
        </v-list-item-group>
      </v-list>
    </v-responsive>
  </v-col>
</template>

<script>

export default {
  name: "ChatList",
  props: {
    parents: {
      type: Array,
      required: true,
    },
    newMsg: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeChat: 1,
      newMsgCount: new Array(this.parents.length).fill(0),
    };
  },
  watch: {
    newMsg() {
      console.log("newMsg", this.newMsg);
    },
  },
  created() {
  },
  methods: {
    selectThread(item) {
      item.count=0;
      this.$emit("selectedTo", item.id);
    },
    
  },
};
</script>
