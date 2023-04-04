<template>
  <app-layout>
    <chat-box :isAdmin="true"></chat-box>
  </app-layout>
</template>

<script>
import ChatBox from "@/components/ChatBox.vue";
import AppLayout from "@/components/AppLayout.vue";

export default {
  components: {
    ChatBox,
    AppLayout,
  },
  created() {
    localStorage.setItem("username", "admin");
  },
};
</script>
