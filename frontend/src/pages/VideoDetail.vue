<template>
  <app-layout>
    <!-- <video-player v-if="visible"
      ref="VideoPlayer"
      :videoURL="videoURL"
      :videoChapters="videoChapters"
      :videoName="videoName"
      :setVideoChapter="0"
      @visiblechapter="visibleChapter"
      @setCurrentChapter="setCurrentChapter"
      @setDuration="setDuration">
    </video-player> -->
    <video-player-simple
      :videoName="videoName"
      :videoURL="videoURL"
      :setCurrentTime="0"
      :alertTimeSet="alertTimeSet"
      @alertTime="alertTime"
    ></video-player-simple>
    <!-- <chat-thread to="admin" @newMsg="updateMsg" :messages="messages"></chat-thread> -->
    <chat-box :isAdmin="false"></chat-box>
  </app-layout>
</template>

<script>
import global from "@/common.vue";
import axios from "axios";

// old version
// import VideoPlayer from "@/components/VideoPlayer.vue";
// new version
import VideoPlayerSimple from "@/components/VideoPlayerSimple.vue";

import AppLayout from "@/components/AppLayout.vue";
// import ChatThread from '../components/ChatThread.vue';
import ChatBox from "@/components/ChatBox.vue";
import socket from "@/socket";

export default {
  components: {
    // VideoPlayer,
    VideoPlayerSimple,
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
      alertTimeSet: [],
    };
  },
  created() {
    this.getAlertTime();
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
    alertTime(index) {
      console.log(index, this.videoName);
      socket.emit("alert", {
        to: "admin",
        index: index,
        name: this.videoName,
      });
    },
    getAlertTime() {
      axios.get(this.videoLog).then((response) => {
        let result = response.data;
        // new
        let vc = {
          start:[],
          end:[]
        };
        result.forEach(element => {
          // time trans: from 1:00 to 60
          let start = parseInt(element.Start.split(":")[0]) * 60 + parseInt(element.Start.split(":")[1]);
          let end = parseInt(element.End.split(":")[0]) * 60 + parseInt(element.End.split(":")[1]);
          vc.start.push(start);
          vc.end.push(end);
        });
        let alerts = global.conditions_1(vc);
        console.log(alerts);
        this.alertTimeSet = alerts;
      });
    },
  },
};
</script>

<style>

</style>