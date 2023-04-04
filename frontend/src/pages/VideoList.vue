<template>
  <app-layout>
    <video-item-group></video-item-group>
  </app-layout>
</template>

<script>
import AppLayout from "../components/AppLayout.vue";
import VideoItemGroup from "../components/VideoItemGroup.vue"

export default {
  components: {
    AppLayout,
    VideoItemGroup,
  },
  created() {
    this.authenticate();
  },
  methods: {
    authenticate() {
      if (localStorage.getItem("username") === null) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style></style>