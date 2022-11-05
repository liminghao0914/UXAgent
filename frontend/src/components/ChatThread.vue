<template>
  <div id="chat-thread">
    <v-container class="fill-height pa-0">
      <v-row class="no-gutters elevation-4 fill-height">
        <!-- chat box -->
        <v-col cols="auto"
          class="flex-grow-1 flex-shrink-0 fill-height">
          <v-responsive v-if="activeChat"
            class="overflow-y-hidden fill-height">
            <v-card flat
              class="d-flex flex-column fill-height">
              <v-card-title> UXAgent </v-card-title>
              <v-card-text class="flex-grow-1 overflow-y-auto px-4 py-0"
                ref="ChatBox">
                <!-- <div ref="ChatBox" class="fill-height overflow-y-auto"> -->
                <template v-for="(msg, i) in messages">
                  <div :class="{ 'd-flex flex-row-reverse': msg.me, 'text-left': !msg.me }"
                    :key="i">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-hover v-slot:default="{ hover }">
                          <v-chip :color="msg.me ? 'primary' : ''"
                            dark
                            style="height: auto; white-space: normal"
                            class="pa-1 mb-2 rounded-lg"
                            v-on="on">
                            {{ msg.content }}
                            <sub class="ml-2"
                              style="font-size: 0.5rem">{{
                                  msg.created_at
                              }}</sub>
                            <v-icon v-if="hover"
                              small>
                              mdi-chevron-down
                            </v-icon>
                          </v-chip>
                        </v-hover>
                      </template>
                      <v-list>
                        <v-list-item>
                          <v-list-item-title>delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </template>
                <!-- </div> -->
              </v-card-text>
              <v-card-text class="flex-shrink-1">
                <v-text-field v-model="messageForm.content"
                  label="type_a_message"
                  type="text"
                  no-details
                  outlined
                  required
                  append-outer-icon="mdi-send"
                  @keyup.enter="sendMessage(messageForm)"
                  @click:append-outer="thisdd()"
                  hide-details />
              </v-card-text>
            </v-card>
          </v-responsive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data: () => ({
    activeChat: 1,
    messages: [
      {
        content: "lorem ipsum",
        me: true,
        created_at: "11:11am",
      },
      {
        content: "dolor",
        me: false,
        created_at: "11:11am",
      },
      {
        content: "dolor",
        me: false,
        created_at: "11:11am",
      },
      {
        content: "dolor",
        me: false,
        created_at: "11:11am",
      },
      {
        content: "dolor",
        me: true,
        created_at: "11:11am",
      },
      {
        content: "dolor",
        me: false,
        created_at: "11:12am",
      },
      {
        content: "dolor",
        me: false,
        created_at: "11:14am",
      },
    ],
    messageForm: {
      content: "",
      me: true,
      created_at: "11:11am",
    },
  }),
  watch: {
    messages: {
      handler: function () {
        // this.$nextTick(() => { CANNOT WORK
        setTimeout(() => {
          console.log("messages changed");
          this.$refs.ChatBox.scrollTop = this.$refs.ChatBox.scrollHeight;
        }, 100);
      },
      deep: true,
    },
  },
  methods: {
    sendMessage(msg) {
      if (msg.content.length > 0) {
        let newMsg = {
          content: msg.content,
          me: true,
          created_at: "11:11am",
        }
        this.messages.push(newMsg);
        this.messageForm.content = ""
        this.$refs.ChatBox.scrollTop = this.$refs.ChatBox.scrollHeight + 20;
      }
    },
    thisdd() {
      this.$refs.ChatBox.scrollTop = this.$refs.ChatBox.scrollHeight + 20;
    }
  }
};
</script>

<style lang="scss">
#chat-thread {
  height: 470px;
  width: 500px;
  right: 20px;
  top: 0px;
  position: absolute;
}

// .fill-height{
//   height: 100%;
// }
</style>