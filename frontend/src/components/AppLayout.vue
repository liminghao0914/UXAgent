<template>
  <div id="container">
    <div id="top-bar" class="top-bar">
      <span>UXAgent</span> 
    </div>
    <div id="body-content" class="body-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLayout",
};
</script>

<style lang="scss">
$background-color: #121826;
$backgroudn-text-color: #a88334;
$top-bar-bcolor: #121826;
$top-bar-tcolor: #ffffff;
$main-video-bcolor: #121826;

html,
body,
#container {
  width: 1440px !important;
  height: 821px !important;
  margin: 0;
  background-color: $background-color;
  color: $backgroudn-text-color;
  position: relative;
  box-shadow: 0px 0px 3px 1px white;
}

#top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background-color: $top-bar-bcolor;
  color: $top-bar-tcolor;
  border-bottom-color: #ffffff;
  border-width: 2px;
}

#top-bar > span {
  position: absolute;
  left: 24px;
  font-family: "Gill Sans", sans-serif;
  line-height: 120%;
  letter-spacing: 0.01em;
  font-weight: 700;
  font-size: 30px;
}

#body-content {
  position: relative;
  display: flex;
  top: 40px;
  left: 0;
  width: 100%;
  height: calc(100% - 40px);
  background-color: $main-video-bcolor;
  overflow: hidden;
}
</style>