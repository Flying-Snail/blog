<template>
  <div class="body">

    <ul class="post-list">
      <li v-for="post in postList" :key="post._id" @click="showPost(post._id)">
        <div class="card-mask">
          <article>
            <p class="title">{{post.title}}</p>
            <p class="time">
              <span>Lin • </span>
              <span>{{formatDate(post.updated_at)}}</span>
            </p>
            <p class="labels">{{formatLabels(post.labels)}}</p>
          </article>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
const post_url = "http://127.0.0.1:3333/admin/api/posts"

export default {
  props: ['labelID', 'searchInput'],
  data () {
    return {
      page: 1,
      postList: []
    }
  },
  created () {
    this.updatePosts()
  },
  methods: {
    formatDate (date) {
      const time = new Date(date)
      return time.getFullYear() + ' 年 ' + (time.getMonth() + 1) + ' 月 ' + time.getDate() + ' 日'
    },

    formatLabels (labels) {
      if (labels.length === 0) return '不分类'
      return labels.join(' • ')
    },

    showPost (id) {
      this.$router.push(`/preview/${id}`)
    },

    updatePosts () {
      const { labelId, search } = this.$route.query
      let url = post_url
      if (labelId) url = post_url + '?page=' + this.page + '&label_id=' + labelId
      if (search) url = post_url + '/search?page=' + this.page + '&search=' + search
      this.$http.get(url).then(rep => {
        const data = rep.data
        this.page = parseInt(data.page)
        this.postList = data.data
      })
    }
  },
  watch: {
    $route () {
      this.updatePosts()
    }
  }
}
</script>


<style scoped>
ul, li {
  margin: 0;
  padding: 0;
}
p {
  margin: 0;
  padding: 0;
}
.body {
  width: 660px;
  margin: auto;
  margin-top: 85px;
}
.post-list {
  list-style: none;
}
.post-list li{
  display: flex;
  height: 248px;
  margin-bottom: 52px;
  background-image: url('../assets/post-bg.jpeg');
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  overflow: hidden;
  transition: 0.3s ease all;
}
.post-list li article {
  display: flex;
  justify-content: center;
  flex-flow: column;
  width: 100%;
  height: 248px;
  color: #fff;
  cursor: pointer;
}
.post-list li:hover {
  box-shadow: 0 22px 43px rgba(0,0,0,0.15);
  transform: translateY(-4px) scale(1.05);
}
.post-list li .card-mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
}
.post-list .title {
  font-size: 25px;
  font-weight: 400;
  margin-bottom: 12px;
}
.post-list .time {
  font-family: Consolas, Menlo,Monaco,"lucida console","Liberation Mono","Courier New","andale mono",monospaceX,monospace,sans-serif;
  font-size: 13px;
  color: #eee;
  font-weight: 400;
  margin-bottom: 12px;
}
.post-list .labels {
  font-family: Consolas, Menlo,Monaco,"lucida console","Liberation Mono","Courier New","andale mono",monospaceX,monospace,sans-serif;
  font-size: 13px;
  color: #eee;
  font-weight: 400;
}
@media screen and (max-width: 1599px) and (min-width: 1302px) {
  .body {
    width: 832px;
  }
}

@media screen and (max-width: 1301px) and (min-width: 768px) {
  .body {
    width: 688px;
  }
}
@media (max-width: 767px) {
  .body {
    width: 660px;
  }
}
</style>
