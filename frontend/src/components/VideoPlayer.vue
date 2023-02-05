<template>
  <div
    class="video_container"
    ref="videoContainer"
    @mouseenter="handleShowFunctions"
    @mouseleave="setTimeoutFunction"
  >
    <div class="spinner" v-if="spinner">
      <v-progress-circular
        indeterminate
        color="var(--primary-color)"
      ></v-progress-circular>
    </div>
    <!-- video div -->
    <div
      class="video_musk"
      v-bind:class="{ video_player_hovering: showFunctions }"
      @click="toggleVideoPlay"
    ></div>
    <video
      ref="videoPlayer"
      class="video_player"
      @loadedmetadata="updateVideoDetails"
      @timeupdate="updateVideoDetails"
      controlslist="nodownload"
      oncontextmenu="return false;"
      @waiting="spinner = true"
      @canplay="spinner = false"
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
    <!-- progress bar -->
    <div class="video_controls mutap" v-show="showProgressBar">
      <div
        class="video_controls_progress_container"
        :style="`margin-bottom:${showFunctions ? '10px' : '15px'}`"
      >
        <div
          ref="videoPlayerProgress"
          class="video_controls_progress"
          @click.prevent.stop="handleProgressClick"
        ></div>
      </div>
      <!-- function bar -->
      <div
        v-if="showFunctions"
        class="video_controls_functions"
        v-on:click.stop
      >
        <div>
          <button class="video_controls_button" @click.stop="toggleVideoPlay">
            <v-icon style="color: #fff" v-if="isPlaying">mdi-pause</v-icon>
            <v-icon style="color: #fff" v-else>mdi-play</v-icon>
          </button>

          <div class="video_controls_duration">
            <span>{{ currentTimeFormatted }}</span
            >/
            <span>{{ durationFormatted }}</span>
          </div>
        </div>
        <div class="video_controls_info">
          <button @click="ChapterDetail()">
            <span class="chapter_info_prefix">•</span>
            <span>Chapter {{ currentChapterInfo + 1 }}</span>
            <div class="chapter_info_chevron">
              <v-icon
                height="100%"
                viewBox="0 0 24 24"
                width="100%"
                color="white"
              >
                mdi-chevron-right
              </v-icon>
            </div>
          </button>
        </div>
        <div class="video_controls_configs">
          <!-- volume track -->
          <div class="video_controls_volume">
            <button
              @click.stop="volumeOptionsOpen = !volumeOptionsOpen"
              ref="volumeTrack"
            >
              <v-icon v-if="volume < 0.1" style="color: #fff"
                >mdi-volume-low</v-icon
              >
              <v-icon
                v-else-if="volume >= 0.1 && volume < 0.8"
                style="color: #fff"
                >mdi-volume-medium</v-icon
              >
              <v-icon v-else-if="volume >= 0.8" style="color: #fff"
                >mdi-volume-high</v-icon
              >
            </button>
            <div
              v-if="volumeOptionsOpen"
              class="video_controls_volume--options"
              ref="videoVolumeTrack"
              @click.stop="handleVolumeClick"
            >
              <div class="video_controls_volume--track">
                <div
                  class="video_controls_volume--track-current"
                  :style="{ height: `${volume * 100}%` }"
                ></div>
                <div
                  class="video_controls_volume--track-ball"
                  :style="{
                    bottom: `Calc(${volume * 100}% - 0.25rem)`,
                  }"
                ></div>
              </div>
            </div>
          </div>
          <!-- speed options -->
          <div class="video_controls_speed">
            <button ref="speed" @click.stop="speedOpen = !speedOpen">
              <span>
                <v-icon style="color: #fff">mdi-speedometer</v-icon>
              </span>
            </button>
            <div v-if="speedOpen" class="video_controls_speed_options">
              <div
                @click.stop="handleVideoPlaybackRate(2.0)"
                :class="{ active: !!(speed === '2x') }"
              >
                2x
              </div>
              <div
                @click.stop="handleVideoPlaybackRate(1.75)"
                :class="{ active: !!(speed === '1.75x') }"
              >
                1.75x
              </div>
              <div
                @click.stop="handleVideoPlaybackRate(1.5)"
                :class="{ active: !!(speed === '1.5x') }"
              >
                1.5x
              </div>
              <div
                @click.stop="handleVideoPlaybackRate(1.0)"
                :class="{ active: !!(speed === '1x') }"
              >
                1x
              </div>
              <div
                @click.stop="handleVideoPlaybackRate(0.75)"
                :class="{ active: !!(speed === '0.75x') }"
              >
                0.75x
              </div>
              <div
                @click.stop="handleVideoPlaybackRate(0.5)"
                :class="{ active: !!(speed === '0.5x') }"
              >
                0.5x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- chapter list card -->
    <transition name="fade">
      <video-steps-list
        :currentChapter="currentChapterInfo"
        :videoName="videoName"
        :videoURL="videoURL"
        :videoChapters="videoChapters"
        @setVideoCurrentTime="setVideoCurrentTime"
        v-show="visibleStepList"
      ></video-steps-list>
    </transition>
  </div>
</template>

<script>
import VideoStepsList from "@/components/VideoStepsList.vue";
import global from "@/common.vue";

export default {
  name: "VideoPlayer",
  components: {
    VideoStepsList,
  },
  props: {
    videoName: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    videoChapters: {
      type: Array,
      required: true,
    },
    setVideoChapter: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    volumeOptionsOpen: false,
    volume: 0.3,
    isPlaying: false,
    isInit: false,
    duration: 0,
    currentTime: 0,
    speed: "1x",
    speedOpen: false,
    videoSrc: null,
    spinner: true,
    showFunctions: false,
    timeout: null,
    showProgressBar: false,
    videoSegments: [],
    visibleStepList: false,
    showStat: false,
    colorMap: global.colorMapUser,
  }),
  computed: {
    currentTimeFormatted() {
      return this.formatTime(this.currentTime);
    },
    durationFormatted() {
      return this.formatTime(this.duration);
    },
    progress() {
      return (this.currentTime / this.duration) * 100;
    },
    currentChapterInfo() {
      let index =
        this.videoChapters.findLastIndex(
          (chapter) => chapter / this.duration <= this.progress / 100
        ) + 1;
      localStorage.chapter = index;
      this.$emit("setCurrentChapter", index);
      return index;
    },
    allUsr: function () {
      return this.$route.query.selectedUser.split(",");
    },
  },
  watch: {
    videoURL(val) {
      if (!!val && val !== this.videoSrc) {
        this.videoSrc = val;
        this.$forceUpdate();
      }
    },
    videoSegments(val) {
      if (!!val && val.length == this.videoChapters.length + 1) {
        this.$emit("videoSegmentsLoaded", val);
      }
    },
  },
  mounted() {
    this.updateVideoDetails();
    this.videoSrc = this.videoURL;
    // this.updateVideoBorder();
    this.setVideoCurrentTime(this.setVideoChapter);
  },
  methods: {
    keyListeners() {
      let key = window.event.keyCode;
      console.log(key);
      // right key
      if (key === 39) {
        this.currentTime += 5;
      }
      // left key
      if (key === 37) {
        this.currentTime -= 5;
      }
      if (key === 32) {
        this.toggleVideoPlay();
      }
    },
    toOtherDetail(user) {
      let thisUrl = this.$route.params.id;
      let task = thisUrl.slice(thisUrl.indexOf("-"));
      this.$router.push({
        path: "/detail/" + user + task,
        query: {
          step: 0,
          selectedUser: this.$route.query.selectedUser,
        },
      });
    },
    updateVideoBorder() {
      let currentUser = this.videoSrc.split("-")[0].split("/").pop();
      this.$refs.videoContainer.style.borderColor = this.colorMap[currentUser];
      this.$refs.videoContainer.style.borderStyle = "solid";
      this.$refs.videoContainer.style.borderWidth = "3px";
    },
    toggleVideoPlay() {
      if (this.$refs?.videoPlayer.paused) {
        this.isPlaying = true;
        this.$refs.videoPlayer.play();
      } else {
        this.isPlaying = false;
        this.$refs.videoPlayer.pause();
      }
    },
    handleVolumeClick(event) {
      const volume = this.$refs.videoVolumeTrack;
      const currentVolume =
        (volume.getBoundingClientRect().top -
          event.pageY +
          volume.offsetHeight) /
        100;
      if (currentVolume > 1) {
        this.volume = currentVolume;
        this.$refs.videoPlayer.volume = 1;
      } else if (currentVolume < 0.1) {
        this.volume = 0;
        this.$refs.videoPlayer.volume = 0;
      } else {
        this.volume = currentVolume;
        this.$refs.videoPlayer.volume = currentVolume;
      }
    },
    updateVideoDetails() {
      if (this.$refs.videoPlayer && this.videoChapters.length > 0) {
        document.addEventListener("keydown", this.keyListeners);
        // init progress bar
        if (!Number.isNaN(this.$refs.videoPlayer.duration)) {
          this.duration = this.$refs.videoPlayer.duration;
          this.$emit("setDuration", this.$refs.videoPlayer.duration);
          if (!this.isInit) {
            this.isInit = true;
            this.setChapters(this.$refs.videoPlayer.duration);
            this.handleShowFunctions();
          }
        }
        this.currentTime = this.$refs.videoPlayer.currentTime;
        if (this.$refs?.videoPlayer.paused) {
          this.isPlaying = false;
          this.$refs.videoPlayer.pause();
        } else {
          this.isPlaying = true;
          this.$refs.videoPlayer.play();
        }
        this.setProgess();
      }
    },
    formatTime(num) {
      let hours = Math.floor(num / 3600);
      let minutes = Math.floor((num % 3600) / 60);
      let seconds = Math.floor(num % 60);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (hours > 0) {
        return hours + ":" + minutes + ":" + seconds;
      }
      return minutes + ":" + seconds;
    },
    handleProgressClick(event) {
      var index = event.target.id.split("-")[1];
      const thisCurrentTime =
        (this.duration * event.offsetX * this.videoSegments[index]) /
        (event.target.offsetWidth * 100);
      // first chapter
      var currentTime = thisCurrentTime;
      if (index == 0) {
        // pass
        currentTime += 0;
      } else {
        currentTime += this.videoChapters[index - 1];
      }
      this.currentTime = currentTime;
      this.$refs.videoPlayer.currentTime = currentTime;
      this.setProgess();
    },
    handleTrackOnDrag(event) {
      if (event.x !== 0 && event.y !== 0) {
        const track = this.$refs.videoPlayerProgress;
        if (track) {
          const leftMovement = event.pageX - track.getBoundingClientRect().left;
          let drag = 0;
          drag = leftMovement;
          if (leftMovement < 0) {
            drag = 0;
          } else if (leftMovement > track.offsetWidth) {
            drag = track.offsetWidth;
          }
          this.currentTime = this.duration * (drag / track.offsetWidth);
          this.$refs.videoPlayer.currentTime = this.currentTime;
        }
      }
    },
    handleVideoPlaybackRate(speed) {
      this.speed = `${speed}x`;
      this.$refs.videoPlayer.playbackRate = speed;
      if (this.speedOpen) {
        this.speedOpen = false;
      }
    },
    handleShowFunctions() {
      if (this.isInit) {
        this.showFunctions = true;
        this.showProgressBar = true;
      }
    },
    setTimeoutFunction() {
      const self = this;
      setTimeout(() => {
        self.showFunctions = false;
        self.speedOpen = false;
        self.volumeOptionsOpen = false;
      }, 3000);

      setTimeout(() => {
        self.showProgressBar = true;
      }, 10000);
    },
    // process bar chapters
    setChapters(duration) {
      for (let i = 0; i < this.videoChapters.length; i++) {
        var chapter = this.videoChapters[i];
        var ratio;
        // if the chapter is the first one
        if (i === 0) {
          ratio = ((chapter / duration) * 100).toString();
        } else {
          var r = ((chapter - this.videoChapters[i - 1]) / duration) * 100;
          ratio = r.toString();
        }
        var node = document.createElement("div");
        node.setAttribute("class", "video_controls_chapter");
        node.setAttribute("id", "video_controls_chapter-" + i);
        node.style.width = ratio + "%";
        this.$refs.videoPlayerProgress.appendChild(node);
        // progress bar green
        var progress = document.createElement("div");
        progress.setAttribute("class", "video_controls_progress_track");
        node.appendChild(progress);
        this.videoSegments.push(ratio);
      }
      // add the last chapter
      var lastRatio = (
        ((duration - this.videoChapters[this.videoChapters.length - 1]) /
          duration) *
        100
      ).toString();
      var lastChapter = document.createElement("div");
      lastChapter.setAttribute("class", "video_controls_chapter");
      lastChapter.setAttribute(
        "id",
        "video_controls_chapter-" + this.videoChapters.length
      );
      lastChapter.style.width = lastRatio + "%";
      lastChapter.style.margin = "0";
      this.$refs.videoPlayerProgress.appendChild(lastChapter);
      var lastProgress = document.createElement("div");
      lastProgress.setAttribute("class", "video_controls_progress_track");
      lastChapter.appendChild(lastProgress);
      this.videoSegments.push(lastRatio);
    },
    // render progress bar
    setProgess() {
      // get all childnodes of videoPlayerProgress whose indics are smaller than index
      let childrenArray = Array.from(
        this.$refs.videoPlayerProgress.childNodes
      ).filter((child) => child.className === "video_controls_chapter");
      if (childrenArray.length === this.videoChapters.length + 1) {
        var percentage = this.progress;
        let index = this.currentChapterInfo;
        // before the index
        var beforePer = 0;
        for (let i = 0; i < index; i++) {
          var beforeElement = document.getElementById(
            "video_controls_chapter-" + i
          );
          beforeElement.childNodes[0].style.width = "100%";
          beforePer += +this.videoSegments[i];
        }

        // this index
        var thisElement = document.getElementById(
          "video_controls_chapter-" + index
        );
        var thisSegment = this.videoSegments[index];
        var thisPer = (percentage - beforePer) / thisSegment;
        thisElement.childNodes[0].style.width = thisPer * 100 + "%";
        localStorage.percentage = parseInt(thisPer * 100);

        // after the index
        for (let i = index + 1; i < childrenArray.length; i++) {
          var afterElement = document.getElementById(
            "video_controls_chapter-" + i
          );
          afterElement.childNodes[0].style.width = "0%";
        }
      }
    },
    // set video current time by chapter index
    setVideoCurrentTime(index) {
      console.log(index);
      // init currentTime
      var currentTime;
      if (index === 0) {
        currentTime = 0;
      } else {
        currentTime = this.videoChapters[index - 1];
      }
      this.$refs.videoPlayer.currentTime = currentTime + 0.1;
    },
    //
    ChapterDetail() {
      if (this.visibleStepList) {
        this.visibleStepList = false;
        this.$refs.videoContainer.style.height = "760px";
      } else {
        this.visibleStepList = true;
        this.$refs.videoContainer.style.height = "640px";
      }
    },
  },
};
</script>

<style lang="scss">
:root {
  --primary-color: #41b883;
  --control-background-color: rgba(45, 45, 45, 0.867);
  --top-options: -120px;
}
$control-background-color: rgba(237, 237, 237, 0);
$primary-color: #41b883;
$main-video-bcolor: #212936;
$highlight-color: #ff3e95;
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.btnactive {
  color: $highlight-color !important;
}

video {
  cursor: default;
}

.video_container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  background: $main-video-bcolor;
  // min-width: 600px;
  // min-height: 300px;
  width: 1080px;
  left: 20px;
  height: 760px;
  // margin: 3px;
  cursor: default;
  transition: all 0.3s ease-in-out;
}

.video_player {
  /* border-radius: 6px; */
  height: 100%;
  width: 100%;
}

.radius-container {
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
  z-index: 31;
  height: 34px;
}
.radius-container > span {
  margin: 0 10px 0 10px;
  line-height: 34px;
  font-size: 20px;
  color: white;
}
.radius-container > .v-input {
  margin-top: 0px;
}
.radius-container > .v-input > .v-input__control {
  height: 30px !important;
  min-height: 30px !important;
}

.video_musk {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 30;
}

.video_player_hovering {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5592830882352942) 0%,
    rgba(255, 255, 255, 0) 25%,
    rgba(255, 255, 255, 0) 100%
  );
}

.d3_statistics {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 31;
  background: #212936dc;
}

.spinner {
  z-index: 2;
  position: absolute;
}

.video_player source {
  height: 100%;
}

.video_controls {
  position: absolute;
  bottom: 1px;
  background: $control-background-color;
  // padding: 15px;
  z-index: 31;
  width: 100%;
  align-items: center;
  color: #fff;
  // border-radius: 6px;
}
.mutap {
  margin-bottom: 0px;
}

.video_controls_progress_container {
  display: flex;
  // width: 100%;
  margin: 0 15px 0 10px;
}

.video_controls_functions {
  display: flex;
  grid-template-columns: 1fr 1fr;
  // width: 100%;
  margin: 0 15px 0 15px;
  height: 40px;
}

.video_controls_functions > div {
  display: flex;
}

.video_controls_functions .video_controls_configs {
  display: flex;
  align-content: center;
  justify-self: flex-end;
  margin-left: auto;
}

.video_controls_functions .video_controls_info {
  // width: 50px;
  margin: 3px 0px 3px 30px;
  align-items: center;
  display: flex;
}

.video_controls_functions .video_controls_info > button {
  display: flex;
  align-items: center;
}

.chapter_info_prefix {
  margin-right: 5px;
}

.chapter_info_chevron {
  -webkit-box-flex: 0;
  -webkit-flex: 0 0 20px;
  -moz-box-flex: 0;
  -ms-flex: 0 0 20px;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  position: relative;
  bottom: 1px;
  display: flex;
  align-content: center;
}

.video_controls_volume {
  display: flex;
  align-content: center;
  position: relative;
}

.video_controls_volume--options {
  position: absolute;
  height: 100px;
  padding: 5px 8px;
  left: 5px;
  top: var(--top-options);
  background: var(--control-background-color);
  border-radius: 0.25rem;
}

.video_controls_volume--track {
  position: relative;
  height: 100%;
  width: 4px;
  border-radius: 6px;
  background-color: #8c8c8c;
}

.video_controls_volume--track-current {
  background-color: var(--primary-color);
  position: absolute;
  bottom: 0;
  left: 0;
  width: 4px;
}

.video_controls_volume--track-ball {
  width: 20px;
  height: 0.9375rem;
  border-radius: 13px;
  position: absolute;
  background-color: #fff;
  border: 0.125rem solid #222;
  left: -7px;
}

.video_controls_duration {
  justify-self: flex-end;
  margin: 3px;
  align-items: center;
  display: flex;
}

.video_controls_duration span {
  margin: 0 3px;
}

.video_controls_progress {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 5px;
  // background: #000;
  height: 0.25rem;
  position: relative;
}

.video_controls_chapter {
  background: rgba(244, 243, 243, 0.663);
  position: relative;
  transition: width 0.2ms;
  display: flex;
  height: 0.25rem;
  margin: 0 4px 0 0;
}
.video_controls_chapter:hover {
  transform: scaleY(2);
  // height: 0.5rem;
}

.video_controls_progress_track {
  background: #41b883;
  transition: width 0.2ms;
  display: flex;
  height: 0.25rem;
  // border-radius: 6px;
  position: absolute;
  pointer-events: none;
}

.video_controls_progress_track--watching {
  height: 1.3rem;
  width: 0.5rem;
  z-index: 33;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #000;
  position: absolute;
  left: 0;
  bottom: -0.5rem;
}

.video_controls_speed {
  display: flex;
  align-content: center;
  position: relative;
  min-width: 60px;
  padding: 0px 15px;
  top: 0;
}

.video_controls_speed_options {
  position: absolute;
  left: 0;
  top: -220px;
  background: var(--control-background-color);
  border-radius: 0.25rem;
}
.video_controls_speed_options .active {
  background: rgba(255, 255, 255, 0.2);
}

.video_controls_speed_options div {
  padding: 5px;
}

.video_controls_speed_options div:hover {
  background: rgba(255, 255, 255, 0.35);
  padding: 5px;
  color: #000;
}

.video_controls_stat {
  display: flex;
  align-content: center;
  position: relative;
  min-width: 60px;
  top: 0;
}
.video_controls_stat > i {
  color: white;
}
</style>
