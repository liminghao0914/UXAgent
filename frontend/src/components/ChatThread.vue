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
              class="d-flex flex-column fill-height"
              color="#00000"
              dark>
              <v-card-title> {{ to }} </v-card-title>
              <div class="btn-group"
                ref="btns">
                <button type="button"
                  class="btn btn-primary"
                  @click="activeChat = 1">
                  <v-icon style="color:#BD9F53">mdi-lightbulb-on</v-icon>
                </button>
                <button type="button"
                  class="btn btn-primary"
                  @click="activeChat = 2">
                  <v-icon style="color:#5D8BE4">mdi-message-processing</v-icon></button>
                <button type="button"
                  class="btn btn-primary active"
                  @click="activeChat = 3">
                  <v-icon style="color:#FFFFFF">mdi-microsoft-xbox-controller-menu</v-icon></button>
              </div>
              <v-card-text class="flex-grow-1 overflow-y-auto px-4 py-0"
                ref="ChatBox"
                id="inner-chat-box">
                <!-- <div ref="ChatBox" class="fill-height overflow-y-auto"> -->
                <template v-for="(msg, i) in messages">
                  <div :class="msgclass(msg)"
                    :key="i"
                    :ref="'ChatBox' + i"
                    class="msg-basic">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <!-- <v-hover v-slot:default="{ hover }"> -->
                        <v-hover>
                          <v-chip :color="msgcolor(msg)"
                            dark
                            style="height: auto; white-space: normal"
                            class="pa-1 mb-2 rounded-lg"
                            v-on="on">
                            {{ msg.content }}
                            <sub class="ml-2"
                              style="font-size: 0.5rem; min-width: 100px;">{{
                                formatTime(msg.created_at)
                              }}</sub>
                            <!-- <v-icon v-if="hover"
                              small>
                              mdi-chevron-down
                            </v-icon> -->
                          </v-chip>
                        </v-hover>
                      </template>
                      <!-- <v-list>
                        <v-list-item>
                          <v-list-item-title>delete</v-list-item-title>
                        </v-list-item>
                      </v-list> -->
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
    activeChat: 3,
    messageForm: {
      content: "",
      me: true,
    },
    filteredMsg: [],
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
    activeChat: {
      handler: function (val) {
        setTimeout(() => {
          console.log("mode changed");
          this.$refs.ChatBox.scrollTop = this.$refs.ChatBox.scrollHeight;
        }, 300);

        this.$refs.btns.children[val - 1].classList.add(
          "active"
        );
        for (let i = 0; i < this.$refs.btns.children.length; i++) {
          if (i != val - 1) {
            this.$refs.btns.children[i].classList.remove("active");
          }
        }
        // only AI
        if (val == 1) {
          for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].fromUser == "admin") {
              console.log(this.$refs[`ChatBox${i}`]);
              this.$refs[`ChatBox${i}`][0].classList.add("msg-no-display");
            } else {
              this.$refs[`ChatBox${i}`][0].classList.remove("msg-no-display");
            }
          }
        }
        // only admin
        else if (val == 2) {
          for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].fromUser == "AI") {
              this.$refs[`ChatBox${i}`][0].classList.add("msg-no-display");
            } else {
              this.$refs[`ChatBox${i}`][0].classList.remove("msg-no-display");
            }
          }
        }
        // all
        else if (val == 3) {
          for (let i = 0; i < this.messages.length; i++) {
            this.$refs[`ChatBox${i}`][0].classList.remove("msg-no-display");
          }
        }
      },
    },
  },
  mounted() {
    this.connect();
    // this.filteredMsg = this.messages.filter((msg) => {
    //   let thisUser = localStorage.getItem("username");
    //   return msg.fromUser == thisUser || msg.toUser == thisUser;
    // });
    // console.log(this.filteredMsg);
  },
  created() {
  },
  methods: {
    isQuestion(text) {
      // Split the text into words
      const words = text.split(" ");
      // Check if the first word is a question word
      const questionWords = [
        "what",
        "when",
        "where",
        "who",
        "whom",
        "whose",
        "which",
        "why",
        "how",
      ];
      if (questionWords.includes(words[0].toLowerCase())) {
        return true;
      }
      // Check if the text ends with a question mark
      if (text.endsWith("?")) {
        return true;
      }
      // If neither of the above conditions are met, return false
      return false;
    },
    msgclass(msg) {
      let ifMe = msg.me;
      let ifAI = msg.fromUser == "AI";
      if (ifMe) {
        return "d-flex flex-row-reverse";
      } else if (ifAI) {
        return "text-left";
      } else {
        return "text-left";
      }
    },
    msgcolor(msg) {
      if (localStorage.getItem("username") !== "admin") {
        let ifMe = msg.me;
        let ifAI = msg.fromUser == "AI";
        if (ifMe) {
          return "";
        } else if (ifAI) {
          return "#BD9F53";
        } else {
          return "#5D8BE4";
        }
      } else {
        let ifMe = msg.me;
        let ifAI = msg.fromUser == "AI";
        if (!ifMe) {
          return "";
        } else if (ifAI) {
          return "#BD9F53";
        } else {
          return "#5D8BE4";
        }
      }
    },
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
        // TODO: change to python AI server. (maybe)
        if (localStorage.getItem("username") == "admin") {
          console.log("admin")
          let response = { content: this.isQuestion(msg.content) ? "I'm sorry, I don't know the answer to that question." : "Received your descriptions" };
          this.sendMessage(response, this.isQuestion(msg.content));
        }
      });

      socket.on("alert", (data) => {
        console.log(data);
        // TODO: change to python AI server. (maybe)
        if (localStorage.getItem("username") == "admin") {
          let videoLog = global.httpUrl+`/videos/${data.name}-r.json`;
          let index = data.index;
          axios.get(videoLog).then((response) => {
            let segment = response.data[index];
            let segment_herustic = segment.Heuristic;
            let responseMsg = { content: `The heuristic of the segment is ${segment_herustic}` };
            this.sendMessage(responseMsg, true);
          });
        }
      });
    },
    sendMessage(msg, isAI=false) {
      if (msg.content.length > 0 && this.to.length > 0) {
        let currentTime = new Date().getTime();
        let fromUser = isAI ? "AI" : this.from;
        console.log("fromUser", fromUser);
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

        socket.emit("chatmsg", { msg: newMsg.content, from: fromUser, to: toUser });
        axios.post(global.httpUrl + "/chat/send", newMsg)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    formatTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  }
};
</script>

<style lang="scss">
#chat-thread {
  height: 760px;
  width: 300px;
  right: 20px;
  top: 0px;
  position: absolute;
}

.btn-group {
  width: 100%;
  display: flex;
}

.btn-group button {
  flex: 1;
  background: rgba(217, 217, 217, 0.17);
  border: 1px solid rgba(255, 255, 255, 0.17);
  height: 50px;
}

.btn-group button:hover {
  background: rgba(217, 217, 217, 0.50);
  transition: all 0.5s;
}

.active {
  background: rgba(217, 217, 217, 0.50) !important;
}

.msg-no-display {
  transform: scaleY(0.3);
  transition: all 0.5s;
}

.msg-no-display span {
  height: 3px !important;
  color: transparent;
}

.msg-basic {
  transition: all 0.5s;
}

#inner-chat-box {
  scroll-behavior: smooth;
}

// .fill-height{
//   height: 100%;
// }
</style>