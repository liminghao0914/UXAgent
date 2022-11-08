<template>
  <v-app>
    <div id="UXAgent">
      <router-view />
    </div>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
$background-color: #121826;

#UXAgent {
  height: 100vh;
  width: 100vw;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  ::-webkit-scrollbar {
    display: none;
  }

  background-color: $background-color;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
</style>
