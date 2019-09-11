<template>
  <div class="preview">
    <Header :title="postData.title" :seeNum="postData.see_num"></Header>
    <div class="container">
      <mavon-editor ref="md" :value="value" :toolbarsFlag="toolbarsFlag"
        :defaultOpen="defaultOpen" :subfield="subfield"
        :editable="editable" class="show-post"/>
      <div class="tool">
        <i class="like" :class="{liked: liked}" @click="handleClickLike(postData._id)"></i>
        <i class="message" @click="goToMessage"></i>
      </div>
      <Comment :postID="postData._id"></Comment>
    </div>
  </div>
</template>

<script>
const post_url = 'http://127.0.0.1:3333/admin/api/posts'
const user_url = 'http://127.0.0.1:3333/admin/api/users'
import Header from '../components/Header'
import Comment from '../components/Comment'

export default {
  components: {
    Header,
    Comment,
  },
  data () {
    return {
      value: '',
      postData: {},
      liked: false,
      toolbarsFlag: false,
      editable: false,
      subfield: false,
      defaultOpen: 'preview'
    }
  },

  created () {
    this.$http.get(`${post_url}/${this.$route.params.id}`).then((result) => {
      this.value = result.data.content
      this.postData = result.data
    }).catch((err) => {
      alert(err.message)
    })
    if (!window.localStorage.getItem('token')) return

    this.$http.get(`${user_url}/show`).then(resp => {
      this.liked = resp.data.liked_posts && resp.data.liked_posts.includes(this.$route.params.id)
    })
  },

  methods: {
    handleClickLike (id) {
      this.liked = !this.liked
      this.$http.post(`${post_url}/like/${id}`, {
        add: this.liked
      })
    },

    goToMessage () {
      document.querySelector('.comment').scrollIntoView()
    }
  }

}
</script>

<style scoped>
.preview{
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.container {
  padding: 0 80px;
  padding-bottom: 30px;
}

.show-post {
  width: 100%;
  background: #fff;
}

.v-show-content {
  background: #fff !important;
}

.v-note-panel.shadow {
  box-shadow: none !important;
}

.tool {
  position: absolute;
  top: 50%;
  left: 40px;
  transform: translateY(-50%);
  display: flex;
  flex-flow: column nowrap;
}

.tool i {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.tool .like {
  background-image: url("../assets/like.svg");
  background-size: 100%;
  margin-bottom: 15px;
}

.tool .liked {
  background-image: url("../assets/like-fill.svg");
}

.tool .message {
  background-image: url("../assets/message-fill.svg");
  background-size: 100%;
}
</style>

<style>
.black .v-show-content {
  background-color: rgba(50, 50, 50, 0.97) !important;
  color: #ccc !important;
}
.black .v-show-content *{
  background-color: rgba(50, 50, 50, 0.97) !important;
  color: #ccc !important;
}
</style>
