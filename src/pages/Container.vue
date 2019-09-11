<template>
  <div class="container">
    <Header :title="title"></Header>
    <PostList></PostList>
  </div>
</template>

<script>
import Header from '../components/Header'
import PostList from '../components/PostList'

export default {
  data () {
    return {
      title: '贾松林的博客',
    }
  },
  components: {
    PostList,
    Header,
  },
}
</script>

<style>
.black .container {
  background-color: rgba(50, 50, 50, 0.97)
}
</style>
