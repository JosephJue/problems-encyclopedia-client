<template>
  <div id="app">
    <div class="header">
      <img
        width="300"
        src="https://gitlab2.rongcloud.net/wangjue/imagespace/-/raw/master/Resource/WechatIMG11944.png"
      />
    </div>
    <router-view></router-view> 
  </div>
</template>



<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  background-color: #cecdcd;
  padding: 10px;
  text-align: center;
  height: 100px;
}
</style>
