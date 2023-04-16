<template>
  <app-layout>
    <video-player v-if="visible"
      ref="VideoPlayer"
      :videoURL="videoURL"
      :videoName="videoName"
      :videoChapters="videoChapters"
      :videoTitles="videoTitles"
      :setVideoChapter="0"
      :alertTimeSet="alertTimeSet"
      @visiblechapter="visibleChapter"
      @setCurrentChapter="setCurrentChapter"
      @setDuration="setDuration"
      @alertTime="alertTime"
      @recordTime="recordTime"
      @videoIsPlaying="videoIsPlaying">
    </video-player>
    <!-- <video-player-simple
      ref="VideoPlayerSimple"
      :videoName="videoName"
      :videoURL="videoURL"
      :alertTimeSet="alertTimeSet"
      @alertTime="alertTime"
      @recordTime="recordTime"
    ></video-player-simple> -->
    <!-- <chat-thread to="admin" @newMsg="updateMsg" :messages="messages"></chat-thread> -->
    <chat-box :isAdmin="false"
      @videoJump="videoJump"></chat-box>
  </app-layout>
</template>

<script>
import global from "@/common.vue";
import axios from "axios";

// old version
import VideoPlayer from "@/components/VideoPlayer.vue";
// new version
// import VideoPlayerSimple from "@/components/VideoPlayerSimple.vue";

import AppLayout from "@/components/AppLayout.vue";
// import ChatThread from '../components/ChatThread.vue';
import ChatBox from "@/components/ChatBox.vue";
import socket from "@/socket";

export default {
  components: {
    VideoPlayer,
    // VideoPlayerSimple,
    AppLayout,
    ChatBox
  },
  data: function () {
    return {
      videoURL: global.httpUrl + "/videos/" + this.$route.params.id + "-v.mp4",
      videoLog: global.httpUrl + "/videos/" + this.$route.params.id + "-r-gpt.json",
      videoSeg: global.httpUrl + "/videos/" + this.$route.params.id + "-seg.json",
      videoChapters: [],
      videoName: this.$route.params.id,
      showChapterSelectionPanel: false,
      duration: 0,
      alertTimeSet: [],
      condition: this.$route.params.condition,
      theVideoIsPlaying: true,
    };
  },
  created() {
    localStorage.percentage = 0;
    this.getAlertTime();
    this.getVideoChapters();
    this.authenticate();
  },
  computed: {
    visible: function () {
      return (
        this.videoChapters.length > 0 && this.alertTimeSet.length > 0
      );
    },
  },
  methods: {
    authenticate() {
      if (localStorage.getItem("username") === null) {
        this.$router.push("/");
      }
    },
    getVideoChapters() {
      axios.get(this.videoSeg).then((response) => {
        var result = response.data;
        var chapters = result.chapters;
        this.videoChapters = chapters.slice(1, chapters.length);
        this.videoTitles = result.titles;
      });
    },
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
    recordTime(videoTime, realTime) {
      let r = {
        // participant: localStorage.getItem("username"),
        // name: this.videoName,
        // condition: this.condition,
        time: videoTime,
        realTime: realTime
      };
      // store in local storage
      if (localStorage.getItem("record") === null) {
        localStorage.setItem("record", "");
      } 
      localStorage.setItem("record", localStorage.getItem("record") + JSON.stringify(r) + "|");
    },
    getAlertTime() {
      axios.get(this.videoLog).then((response) => {
        let result = response.data;
        // new
        let vc = {
          start: [],
          end: []
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
      this.$refs.VideoPlayer.setCurrentTime(time_int);
    },
    videoIsPlaying(isPlaying) {
      // if video stopped, send to server
      this.theVideoIsPlaying = isPlaying;
      if (!isPlaying) {
        let record_list = localStorage.getItem("record").split("|");
        axios.post(global.httpUrl + "/record", {
          participant: localStorage.getItem("username"),
          name: this.videoName,
          condition: this.condition,
          record: record_list
        });
      }
    }
  },
};
</script>

<style></style>