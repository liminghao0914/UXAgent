<template>
  <app-layout>
    <video-player v-if="visible"
      ref="VideoPlayer"
      :videoURL="videoURL"
      :videoChapters="videoChapters"
      :videoName="videoName"
      :setVideoChapter="0"
      @visiblechapter="visibleChapter"
      @setCurrentChapter="setCurrentChapter"
      @setDuration="setDuration">
    </video-player>
    <!-- <chat-thread to="admin" @newMsg="updateMsg" :messages="messages"></chat-thread> -->
    <chat-box :isAdmin="false"></chat-box>
  </app-layout>
</template>

<script>
import global from "@/common.vue";
import axios from "axios";

import VideoPlayer from "@/components/VideoPlayer.vue";
import AppLayout from "@/components/AppLayout.vue";
// import ChatThread from '../components/ChatThread.vue';
import ChatBox from "@/components/ChatBox.vue";

export default {
  components: {
    VideoPlayer,
    AppLayout,
    ChatBox
  },
  data: function () {
    return {
      videoURL: global.httpUrl + "/videos/" + this.$route.params.id + "-v.mp4",
      videoLog: global.httpUrl + "/videos/" + this.$route.params.id + "-r.json",
      videoChapters: [],
      videoName: this.$route.params.id,
      showChapterSelectionPanel: false,
      duration: 0,
    };
  },
  created() {
    this.getVideoChapters();
  },
  computed: {
    visible: function () {
      return (
        this.videoChapters.length > 0
      );
    },
  },
  methods: {
    visibleChapter(chapter) {
      this.currentChapter = chapter - 1;
      if (chapter === -1) {
        this.showChapterSelectionPanel = false;
      } else {
        this.showChapterSelectionPanel = true;
      }
    },
    setCurrentChapter(chapter) {
      this.currentChapter = chapter;
    },
    setDuration(duration) {
      this.duration = duration;
    },
    getVideoChapters() {
      axios.get(this.videoLog).then((response) => {
        let result = response.data;
        // new
        let vc = [];
        result.forEach(element => {
          // time trans: from 1:00 to 60
          let start = parseInt(element.Start.split(":")[0]) * 60 + parseInt(element.Start.split(":")[1]);
          let end = parseInt(element.End.split(":")[0]) * 60 + parseInt(element.End.split(":")[1]);
          vc.push(start);
          vc.push(end);
        });
        // old
        // var scroll_list = result.scrolls;
        // var start_time = scroll_list[0].time;
        // var vc = [];
        // for (let i = 1; i < scroll_list.length; i++) {
        //   if (scroll_list[i].event === "pagestart") {
        //     vc.push(scroll_list[i].time - start_time);
        //   }
        // }
        this.videoChapters = vc;
        console.log(this.videoChapters);
      });
    },
  },
};
</script>

<style>

</style>