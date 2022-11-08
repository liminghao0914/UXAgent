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
              <v-card-title> {{to}} </v-card-title>
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
                  @click:append-outer="sendMessage(messageForm)"
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
import axios from 'axios';
import global from "@/common.vue";
import socket from "@/socket.js";

export default {
  name: "ChatThread",
  props: {
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    activeChat: 1,
    messageForm: {
      content: "",
      me: true,
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
  mounted() {
    this.connect();
  },
  created() {
  },
  methods: {
    connect() {
      socket.userID = localStorage.getItem("username");
      socket.open()
      console.log(this.sockets)

      socket.emit("join", localStorage.getItem("username"));

      socket.on("private message", (msg) => {
        console.log(msg.created_at)
        let newMsg = {
          content: msg.content,
          me: false,
          created_at: msg.created_at,
          fromUser: msg.fromUser,
          toUser: msg.toUser,
        };
        // this.messages.push(newMsg);
        this.$emit("newMsg", newMsg);
      });
    },
    sendMessage(msg) {
      if (msg.content.length > 0 && this.to.length > 0) {
        let currentTime = new Date().toLocaleTimeString();
        let fromUser = this.from;
        let toUser = this.to;
        let newMsg = {
          content: msg.content,
          me: true,
          created_at: currentTime,
          fromUser: fromUser,
          toUser: toUser,
        }
        // this.messages.push(newMsg);
        this.$emit("newMsg", newMsg);
        this.messageForm.content = ""
        this.$refs.ChatBox.scrollTop = this.$refs.ChatBox.scrollHeight;

        socket.emit("chatmsg", { msg: newMsg.content, to: toUser });
        axios.post(global.httpUrl + "/chat/send", newMsg)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
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