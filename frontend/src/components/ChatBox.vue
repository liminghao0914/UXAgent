<template>
  <div class="chat-box">
    <chat-list v-if="isAdmin"
      :parents="parents"
      :newMsg="newMsg"
      @selectedTo="selectedTo"></chat-list>
    <chat-thread :to="to"
      :from="from"
      :messages="messages"
      @newMsg="updateMsg"
      @videoJump="videoJump"></chat-thread>
  </div>
</template>

<script>
import axios from "axios";
import global from "@/common.vue";

import ChatThread from "@/components/ChatThread.vue";
import ChatList from "@/components/ChatList.vue";

export default {
  name: "ChatBox",
  components: {
    ChatThread,
    ChatList,
  },
  props: {
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      parents: [],
      newMsg: {},
      to: "",
      messages: [],
      from: localStorage.getItem("username"),
    };
  },
  watch: {
    parents: {
      handler: function (val) {
        console.log("parents changed", val);
      },
      deep: true,
    },
  },
  created() {
    this.getChatList();
  },
  methods: {
    updateMsg(msg) {
      console.log("update", msg);
      this.newMsg = msg;
      // update chatlist
      let index = this.parents.findIndex(
        (parent) => parent.id === this.newMsg.fromUser
      );
      let toIndex = this.parents.findIndex(
        (parent) => parent.id === this.newMsg.toUser
      );
      // if parent not found
      if (index == -1) {
        // if parent not found
        if (toIndex == -1) {
          console.log("parent not found");
          this.parents.push({
            id: this.newMsg.fromUser,
            title: this.newMsg.fromUser,
            count: 1,
            content: this.newMsg.content,
          });
        } else {
          // new parent
          this.parents[toIndex].content = this.newMsg.content;
        }
      } else {
        this.parents[index].count += 1;
        this.parents[index].content = this.newMsg.content;
      }
      // update chatthread
      this.messages.push(msg);
    },
    selectedTo(to) {
      console.log("selectedTo", to);
      this.to = to;
      // sort by time
      this.messages = this.parents.find((parent) => parent.id === to).messages.sort((a, b) => {
        return a.created_at - b.created_at;
      });
    },
    getChatList() {
      axios
        .get(global.httpUrl + "/chat/getAll")
        .then((res) => {
          let allchat = res.data;
          this.parents = this.allChat2Parents(allchat);
          console.log("parents", this.parents);
          if (!this.isAdmin) {
            console.log("not admin");
            this.to = "admin";
            let msg_admin = this.parents.find(
              (parent) => parent.id === "admin"
            ).messages.filter((msg) => msg.fromUser == this.from || msg.toUser == this.from);
            // sort by time
            msg_admin.sort((a, b) => {
              return a.created_at - b.created_at;
            });
            try {
              let msg_ai = this.parents.find(
                (parent) => parent.id === "AI"
              ).messages.filter((msg) => msg.fromUser == this.from || msg.toUser == this.from);
              this.messages = msg_admin.concat(msg_ai);
              // sort by time
              this.messages.sort((a, b) => {
                return a.created_at - b.created_at;
              });
            } catch (err) {
              console.log("NO AI Chat");
              this.messages = msg_admin;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    allChat2Parents(allchat) {
      let parents = [];
      allchat.forEach((item) => {
        let parent = parents.find(
          (parent) => parent.id == item.fromUser || parent.id == item.toUser
        );
        // console.log(parent);
        // if parent found
        if (parent) {
          if (parent.id == item.fromUser) {
            item.me = false;
          } else {
            item.me = true;
          }
          parent.messages.push(item);
          parent.count += 1;
        } else {
          if (item.fromUser == this.from) {
            parents.push({
              id: item.toUser,
              title: item.toUser,
              content: item.content,
              messages: [item],
              count: 1,
            });
          } else {
            parents.push({
              id: item.fromUser,
              title: item.fromUser,
              content: item.content,
              messages: [item],
              count: 1,
            });
          }
        }
      });
      return parents;
    },
    videoJump(time) {
      this.$emit("videoJump", time);
    },
  },
};
</script>

<style lang="scss">
.chat-box {
  width: 100vw;
  height: 100vh;
}
</style>
