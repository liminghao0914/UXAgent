<template>
  <v-card class="mx-auto" @mouseenter="show = true" @mouseleave="show = false" @click="toDetail()">
    <v-img
      :src="getCoverURL()"
      :lazy-src="getCoverURL()"
      height="112.5px"
      width="200px"
    ></v-img>
    <v-card-title > {{ videoTitle }} </v-card-title>
    <div class="subtitle"> {{ videoTime }} </div>
    <!-- <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-actions> -->
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>
        <v-card-text>
          {{ videoDescription }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
export default {
  name: "VideoItem",
  props: {
    videoURL: {
      type: String,
      required: true,
    },
    videoCover: {
      type: String,
      required: true,
    },
    videoTitle: {
      type: String,
      required: true,
    },
    videoTime: {
      type: String,
      required: true,
    },
    videoWebsite: {
      type: String,
      required: false,
    },
    videoDescription: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    show: false,
  }),
  mouted() {
    console.log(this.videoURL);
  },
  methods: {
    getCoverURL() {
      return this.videoCover;
    },
    toDetail() {
      console.log(this.videoTitle);
      // go to detail page '/detail/'+this.videoTitle;
      this.$router.push({
        path: "/detail/" + this.videoTitle,
      });
    },
  },
};
</script>

<style lang="scss">
.mx-auto{
  height: 100%;
  width: 100%;
}

.v-card__title{
  font-size: revert;
  padding: 0 10px 0 10px;
}
.subtitle{
  font-size: xx-small;
  padding: 0 10px 0 10px;
  margin-bottom: auto;
}
</style>