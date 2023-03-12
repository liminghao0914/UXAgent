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
      ref="VideoPlayerSimple"
      :videoName="videoName"
      :videoURL="videoURL"
      :alertTimeSet="alertTimeSet"
      @alertTime="alertTime"
      @recordTime="recordTime"
    ></video-player-simple>
    <!-- <chat-thread to="admin" @newMsg="updateMsg" :messages="messages"></chat-thread> -->
    <chat-box 
      :isAdmin="false"
      @videoJump="videoJump"></chat-box>
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
      condition: this.$route.params.condition,
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
    alertTime(index, videoTime) {
      console.log(index, videoTime);
      socket.emit("alert", {
        to: "admin",
        index: index,
        name: this.videoName,
        condition: this.condition,
        time: videoTime,
      });
    },
    recordTime(videoTime, realTime){
      console.log(videoTime, realTime);
      axios.post(global.httpUrl + "/record", {
        participant: localStorage.getItem("username"),
        name: this.videoName,
        condition: this.condition,
        time: videoTime,
        realTime: realTime,
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
        let alerts = global.conditions[this.condition](vc);
        console.log(alerts);
        this.alertTimeSet = alerts;
      });
    },
    videoJump(time) {
      let time_int = parseInt(time);
      this.$refs.VideoPlayerSimple.setCurrentTime(time_int);
    },
  },
};
</script>

<style>

</style>