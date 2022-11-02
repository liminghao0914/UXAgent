<template>
  <div class="video-steps-list" ref="videoStepsList">
    <v-sheet v-if="visible" elevation="8" width="100%" height="124">
      <v-slide-group
        v-model="model"
        class="pa-4"
        active-class="success"
        show-arrows
      >
        <v-slide-item
          v-for="(n, index) in videoChapterCovers"
          :key="n"
          v-slot="{ active, toggle }"
        >
          <v-card
            :color="active ? undefined : 'grey lighten-1'"
            class="ma-4"
            @click="toggle"
            height="92"
            width="164"
            tile
            outlined
          >
            <v-img
              height="90"
              :src="n"
              @click="setVideoCurrentTime(index)"
            ></v-img>
            <div class="chapter-tag">{{ videoName }}-S{{ index + 1 }}</div>
            <v-row class="fill-height" justify="center"> </v-row>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import global from "../common.vue";
export default {
  props: {
    videoURL: {
      type: String,
    },
    videoChapters: {
      type: Array,
      required: true,
    },
    videoName: {
      type: String,
    },
    currentChapter: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      model: 0,
      videoChapterCovers: [],
      colorMap: global.colorMapUser,
    };
  },
  computed: {
    visible() {
      return this.videoChapterCovers.length > 0;
    },
  },
  watch: {
    currentChapter(newVal) {
      this.model = newVal;
      this.$forceUpdate();
    },
  },
  created() {
    this.getVideoChapters();
  },
  mounted(){

    // this.updateVideoBorder()
  },
  methods: {
    updateVideoBorder() {
      let currentUser = this.videoName.split("-")[0];
      this.$refs.videoStepsList.style.borderColor = this.colorMap[currentUser];
      this.$refs.videoStepsList.style.borderStyle = "solid";
      this.$refs.videoStepsList.style.borderWidth = "0 3px 3px 3px";
    },
    getVideoChapters() {
      for (let i = 0; i < this.videoChapters.length + 1; i++) {
        var cover =
          global.httpUrl +
          "/covers/" +
          this.videoName +
          "-c" +
          (i + 1) +
          ".png";
        // console.log(cover);
        this.videoChapterCovers.push(cover);
      }
    },
    setVideoCurrentTime(index) {
      this.$emit("setVideoCurrentTime", index);
    },
  },
};
</script>

<style lang="scss">
$main-video-bcolor: #121826;
.video-steps-list {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  min-width: 600px;
  width: calc(100% + 6px);
  // top: calc(50% + 40px);
  // height: calc(20% - 40px);
  bottom: 0;
  transform: translateY(100%);
}
.video-steps-list .v-slide-group {
  background-color: $main-video-bcolor;
}
.v-card .v-card--link .v-sheet {
  margin: 10px !important;
  cursor: pointer;
}
.v-slide-group__next,
.v-slide-group__prev {
  min-width: 10px !important;
}
.v-slide-group .v-icon {
  color: #fff !important;
}
.v-slide-group .v-icon--disabled {
  color: #fff !important;
}
.v-application .pa-4 {
  padding: 0px !important;
}

.chapter-tag {
  position: absolute;
  right: 10px;
  bottom: 5px;
  font-size: 12px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>