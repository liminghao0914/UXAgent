<template>
  <div class="simple-video-player"
    ref="videoContainer"
    @mouseenter="handleShowFunctions"
    @mouseleave="setTimeoutFunction"
    @keyup.right="forwardTime(5)">
    <div class="spinner"
      v-if="spinner">
      <v-progress-circular indeterminate
        color="var(--prime-color)"></v-progress-circular>
    </div>
    <div class="simple_video_musk"
      v-bind:class="{ video_player_hovering: showFunctions }"
      @click="toggleVideoPlay"></div>
    <video ref="videoPlayer"
      class="video__player"
      @loadedmetadata="updateVideoDetails"
      @timeupdate="updateVideoDetails"
      controlslist="nodownload"
      oncontextmenu="return false;"
      @waiting="spinner = true"
      @canplay="spinner = false"
      :src="videoSrc">
      <source type="video/mp4" />
    </video>
    <div class="video__controls">
      <div class="video__controls__progress__container"
        :style="`margin-bottom:${showFunctions ? '10px' : '0'}`">
        <div ref="videoPlayerProgress"
          class="video__controls__progress"
          @click.prevent.stop="handleProgressClick">
          <div class="video__controls__progress__track"
            :style="{ width: progress + '%' }">
            <!-- <div
            class="video__controls__progress__track--watching"
            :style="{ left: progress + '%' }"
            draggable
            @drag.stop.prevent="handleTrackOnDrag"
          ></div> -->
          </div>
        </div>
      </div>
      <div v-if="showFunctions"
        class="video__controls__functions">
        <div>
          <button class="video__controls__button"
            @click.stop="toggleVideoPlay">
            <v-icon style="color: #fff"
              v-if="isPlaying">mdi-pause</v-icon>
            <v-icon style="color: #fff"
              v-else>mdi-play</v-icon>
          </button>

          <div class="video__controls__duration">
            <span>{{ currentTimeFormatted }}</span>/
            <span>{{ durationFormatted }}</span>
          </div>
        </div>
        <div class="video__controls__configs">
          <div class="video__controls__volume">
            <button @click.stop="volumeOptionsOpen = !volumeOptionsOpen"
              ref="volumeTrack">
              <v-icon v-if="volume < 0.1"
                style="color: #fff">mdi-volume-low</v-icon>
              <v-icon v-else-if="volume >= 0.1 && volume < 0.8"
                style="color: #fff">mdi-volume-medium</v-icon>
              <v-icon v-else-if="volume >= 0.8"
                style="color: #fff">mdi-volume-high</v-icon>
            </button>
            <div v-if="volumeOptionsOpen"
              class="video__controls__volume--options"
              ref="videoVolumeTrack"
              @click.stop="handleVolumeClick">
              <div class="video__controls__volume--track">
                <div class="video__controls__volume--track-current"
                  :style="{ height: `${volume * 100}%` }"></div>
                <div class="video__controls__volume--track-ball"
                  :style="{
                    bottom: `Calc(${volume * 100}% - 0.25rem)`,
                  }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import global from "@/common.vue";

export default {
  props: {
    videoName: {
      type: String,
      required: true,
    },
    videoURL: {
      type: String,
      required: true,
    },
    setCurrentTime: {
      type: Number,
      required: true,
    },
    alertTimeSet: {
      type: Array,
      required: true,
    }
  },
  data: () => ({
    volumeOptionsOpen: false,
    volume: 0.3,
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    videoSrc: null,
    spinner: true,
    showFunctions: true,
    timeout: null,
    showProgressBar: true,
    colorMap: global.colorMapUser,
    currentUser: "",
    alertTimeSetThis: [],
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
  },
  watch: {
    videoURL(val) {
      if (!!val && val !== this.videoSrc) {
        this.videoSrc = val;
        this.$forceUpdate();
      }
      this.currentUser = val.split("-")[0].split("/").pop();
      this.updateVideoBorder();
    },
    setCurrentTime(val) {
      this.currentTime = val + 0.1;
      this.$refs.videoPlayer.currentTime = val + 0.1;
    },
    alertTimeSet(val) {
      this.alertTimeSetThis = val;
    },
    currentTime(val) {
      // console.log((val * 4).toFixed(0));
      this.alertTimeSetThis.forEach((time, i) => {
        if ((val * 4).toFixed(0) == time * 4) {
          this.$emit("alertTime", i, this.videoName);
        }
      })
    },
  },
  mounted() {
    // const that = this;
    this.updateVideoDetails();
    this.videoSrc = this.videoURL;
    this.currentUser = this.videoSrc.split("-")[0].split("/").pop();
  },
  methods: {
    keyListeners() {
      let key = window.event.keyCode;
      console.log(key);
      // right key
      if (key === 39) {
        this.currentTime += 5;
        this.$refs.videoPlayer.currentTime += 5;
      }
      // left key
      if (key === 37) {
        this.currentTime -= 5;
        this.$refs.videoPlayer.currentTime -= 5;
      }
      if (key === 32) {
        this.toggleVideoPlay();
      }
    },
    updateVideoBorder() {
      this.$refs.videoContainer.style.borderColor =
        this.colorMap[this.currentUser];
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
      if (this.$refs.videoPlayer) {
        // document.addEventListener("keydown", this.keyListeners);
        if (!Number.isNaN(this.$refs.videoPlayer.duration)) {
          this.duration = this.$refs.videoPlayer.duration;
        }
        this.currentTime = this.$refs.videoPlayer.currentTime;
        if (this.$refs?.videoPlayer.paused) {
          this.isPlaying = false;
          this.$refs.videoPlayer.pause();
        } else {
          this.isPlaying = true;
          this.$refs.videoPlayer.play();
        }
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
      const currentTime =
        (this.duration * event.offsetX) /
        this.$refs.videoPlayerProgress.offsetWidth;
      this.currentTime = currentTime;
      this.$refs.videoPlayer.currentTime = currentTime;
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
    handleShowFunctions() {
      this.showFunctions = true;
      this.showProgressBar = true;
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
      }, 1000);
    },
    forwardTime(time) {
      this.currentTime += time;
      this.$refs.videoPlayer.currentTime += time;
    },
  },
};
</script>

<style lang="scss">
:root {
  --prime-color: #41b883;
}

$prime-color: #41b883;
$main-video-bcolor: #212936;
$control-background-color: rgba(237, 237, 237, 0);
$volume-background-color: rgba(237, 237, 237, 0.5);

.simple-video-player {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: $main-video-bcolor;
  position: absolute;
  // min-width: 600px;
  // min-height: 300px;
  width: 1080px;
  left: 20px;
  height: 760px;
  // margin: 3px;
  cursor: default;
  transition: all 0.3s ease-in-out;
}

.video__player {
  border-radius: 6px;
  height: 100%;
  width: 100%;
}

.spinner {
  z-index: 2;
  position: absolute;
}

.video__player source {
  height: 100%;
}

.video__controls {
  position: absolute;
  bottom: 0;
  background: $control-background-color;
  padding: 15px 5px 5px 5px;
  z-index: 61;
  width: 100%;
  align-items: center;
  color: #fff;
  margin-bottom: 10px;
  user-select: none;
  // border-radius: 6px;
}

.video__controls__progress__container {
  display: flex;
  width: 100%;
}

.video__controls__functions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.video__controls__functions>div {
  display: flex;
}

.video__controls__functions .video__controls__configs {
  display: flex;
  justify-self: flex-end;
}

.video__controls__volume {
  margin-right: 20px;
  position: relative;
}

.video__controls__volume--options {
  position: absolute;
  height: 100px;
  padding: 5px 8px;
  bottom: 30px;
  background: $volume-background-color;
  border-radius: 0.25rem;
}

.video__controls__volume--track {
  position: relative;
  height: 100%;
  width: 4px;
  border-radius: 6px;
  background-color: #8c8c8c;
}

.video__controls__volume--track-current {
  background-color: $prime-color;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 4px;
}

.video__controls__volume--track-ball {
  width: 20px;
  height: 0.9375rem;
  border-radius: 13px;
  position: absolute;
  background-color: #fff;
  border: 0.125rem solid #222;
  left: -7px;
}

.video__controls__duration {
  justify-self: flex-end;
  margin: 3px;
}

.video__controls__duration span {
  margin: 0 3px;
}

.video__controls__progress {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0 0.45rem;
  background: #f4f3f3a9;
  height: 0.25rem;
  position: relative;
  cursor: pointer;
}

.video__controls__progress__track {
  background: $prime-color;
  transition: width 0.2ms;
  display: flex;
  height: 0.25rem;
  border-radius: 6px;
  z-index: 50;
}

.video__controls__progress:hover {
  transform: scaleY(2);
  // height: 0.5rem;
}

.video__controls__progress__track--watching {
  height: 1.3rem;
  width: 0.5rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #000;
  position: absolute;
  left: 0;
  bottom: -0.5rem;
}

.simple_video_musk {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 60;
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
</style>