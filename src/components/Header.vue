<template>
  <div class="header">
    <div class="mask">
      <div class="title-area">
        <h1>{{title}}</h1>
        <h2 v-show="seeNum">至今已被浏览过{{seeNum}}次</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'seeNum'],
  data () {
    return {
      input: ''
    }
  },
}
</script>


<style scoped>
.header {
  position: relative;
  height: 394px;
  width: 100%;
  background: url('../assets/title-bg.jpeg');
  background-size: cover;
  background-position: center;
}
.header .mask {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
}

.header .title-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.header h1, h2 {
  color: #fff;
}

.header h1 {
  font-size: 40px;
}

.header h2 {
  font-family: Consolas, Menlo,Monaco,"lucida console","Liberation Mono","Courier New","andale mono",monospaceX,monospace,sans-serif;
  font-size: 13px;
  color: #eee;
  font-weight: 400;
}

@media (max-width: 420px) {
  .header h1{
    font-size: 30px;
  }
}
</style>
