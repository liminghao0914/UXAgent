<template>
  <div id="main-contianer">
    <video-player
      ref="VideoPlayer"
      :videoURL="videoURL"
      :videoChapters="videoChapters"
      :videoName="videoName"
      :setVideoChapter="0"
      @visiblechapter="visibleChapter"
      @videoSegmentsLoaded="getVideoSegments"
      @setCurrentChapter="setCurrentChapter"
      @setDuration="setDuration">
    </video-player>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';

export default {
  components: { VideoPlayer },

}
</script>

<style>

</style>