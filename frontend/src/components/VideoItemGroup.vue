<template>
  <div class="video-item-group">
    <v-item-group active-class="primary">
      <v-container>
        <v-row>
          <v-col v-for="(info, i) in infos" :key="i" cols="8" md="3">
            <v-item v-slot="{ toggle }">
              <v-card
                class="d-flex align-center"
                dark
                @click="toggle"
                width="200px"
              >
                <video-item
                  :videoTitle="info.property.name"
                  :videoTime="convertTimestamp2Date(info.property.time)"
                  :videoWebsite="info.property.website"
                  :videoDescription="getDescription(info.property.name)"
                  :videoURL="server + info.video"
                  :videoCover="getCover(info.property.name)"
                ></video-item>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </div>
</template>

<script>
import axios from "axios";
import VideoItem from "./VideoItem.vue";
import global from "../common.vue";

export default {
  components: { VideoItem },
  name: "VideoItemGroup",
  componets: {
    VideoItem,
  },
  computed: {},
  data: () => ({
    length: 0,
    infos: [],
    server: global.httpUrl,
  }),
  mounted() {
    this.getVideoList();
  },
  methods: {
    getVideoList() {
      axios.get(this.server + "/infos/list").then((response) => {
        var result = response.data;
        this.length = result.length;
        this.infos = result;
      });
    },
    convertTimestamp2Date(timestamp) {
      var date = new Date(timestamp * 1000);
      return date.toDateString();
    },
    getCover(name) {
      let cover_name = name + "-c1.png";
      return global.httpUrl + "/covers/" + cover_name;
    },
    getDescription(name) {
      // return {
      //   participant: name.split("-")[0],
      //   website: name.split("-")[1],
      //   task: name.split("-")[2],
      // };
      return `Click to watch the video of ${name}`
    },
  },
};
</script>

<style lang="scss">
.video-item-group {
  height: 781px;
  width: 1440px;
  overflow-y: scroll;
}
.v-item-group {
  width: 100%;
}
.flex-grow-1 {
  width: 100%;
}
</style>