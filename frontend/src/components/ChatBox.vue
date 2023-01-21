<template>
  <div class="chat-box">
    <chat-list
      v-if="isAdmin"
      :parents="parents"
      :newMsg="newMsg"
      @selectedTo="selectedTo"
    ></chat-list>
    <chat-thread
      :to="to"
      :from="from"
      @newMsg="updateMsg"
      :messages="messages"
    ></chat-thread>
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
      if (index == -1) {
        if (toIndex == -1) {
          console.log("parent not found");
          this.parents.push({
            id: this.newMsg.fromUser,
            title: this.newMsg.fromUser,
            count: 1,
            content: this.newMsg.content,
          });
        } else {
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
      this.messages = this.parents.find((parent) => parent.id === to).messages;
    },
    getChatList() {
      axios
        .get(global.httpUrl + "/chat/getAll")
        .then((res) => {
          let allchat = res.data;
          this.parents = this.allChat2Parents(allchat);
          if (!this.isAdmin) {
            this.to = "admin";
            let msg_admin = this.parents.find(
              (parent) => parent.id === "admin" 
            ).messages.filter((msg) => msg.fromUser == this.from || msg.toUser == this.from);
            let msg_ai = this.parents.find(
              (parent) => parent.id === "AI" 
            ).messages.filter((msg) => msg.fromUser == this.from || msg.toUser == this.from);
            this.messages = msg_admin.concat(msg_ai);
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
        if (parent) {
          if (parent.id == item.fromUser) {
            item.me = false;
          } else {
            item.me = true;
          }
          parent.messages.push(item);
        } else {
          if (item.fromUser == this.from) {
            parents.push({
              id: item.toUser,
              title: item.toUser,
              content: item.content,
              messages: [item],
              count: allchat.length,
            });
          } else {
            parents.push({
              id: item.fromUser,
              title: item.fromUser,
              content: item.content,
              messages: [item],
              count: allchat.length,
            });
          }
        }
      });
      return parents;
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
