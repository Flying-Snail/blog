<template>
  <div id="app">
    <Nav></Nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Nav from './components/Nav'

export default {
  components: {
    Nav,
  },
  created () {
    document.title = '贾松林的博客'
  },
  name: 'app',
}
</script>

<style>
* {
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  color: #777;
}
#app {
  font-family: 'Mirages Custom', 'Merriweather', 'Open Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft Yahei', 'WenQuanYi Micro Hei',  'Segoe UI Emoji', 'Segoe UI Symbol', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  margin: auto;
}
</style>
