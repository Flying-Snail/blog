<template>
<div class="comment">
  <div class="header">
    <p>添加更多评论</p>
    <textarea name="comment" placeholder="在这里输入您的评论" class="comment-area"
      v-model="content"></textarea>
    <button class="submit" @click="submit">提交评论</button>
  </div>

  <div class="comment-list">
    <p class="title">已有{{num}}条评论</p>

    <ul class="list-area">
      <li v-for="(comment, index) in commentList" :key="comment._id">
        <div class="header">
          <img :src="asset_url + comment.avatar_path" alt="">

          <div class="user">
            <p class="user-name">{{comment.nick_name}}</p>
            <p class="comment-time">{{formatDate(comment.updated_at)}}</p>
          </div>

          <button v-show="showDelete" @click="deleteComment(comment._id)">删除</button>
          <button class="reply-btn" @click="handleClickReplyBtn(index, comment._id, comment.user_id)">回复</button>
        </div>

        <p class="content">{{comment.content}}</p>

        <ul class="replys list-area">
          <li v-for="reply in comment.replys">
             <div class="header">
              <img :src="asset_url + reply.avatar_path" alt="">

              <div class="user">
                <p class="user-name">{{reply.nick_name}} 回复了 {{reply.replyed_nick_name}}</p>
                <p class="comment-time">{{formatDate(reply.updated_at)}}</p>
              </div>

              <button v-show="showDelete" @click="deleteComment(reply._id)">删除</button>
              <button class="reply-btn" @click="handleClickReplyBtn(index, comment._id, reply.user_id)">回复</button>
            </div>

            <p class="content">{{reply.content}}</p>
          </li>
        </ul>

        <div class="reply" v-show="comment.replyShow">
          <textarea name="reply" placeholder="在这里填写回复" class="comment-area"
            v-model="replyContent"></textarea>
          <button class="submit" @click="submitReply(index)">提交回复</button>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
const comment_url = "http://127.0.0.1:3333/admin/api/comment"
const user_url = "http://127.0.0.1:3333/admin/api/users"

export default {
  props: ['num', 'postID'],
  data () {
    return {
      content: '',
      user_id: '',
      commentList: [],
      replyContent: '',
      asset_url: 'http://images.blog:8002',
      replyed_id: '',
      replyed_user_id: '',
      showDelete: false,
    }
  },
  created () {
    this.$http.get(`${user_url}/show`).then(resp => {
      this.user_id = resp.data._id
      this.showDelete = resp.data.admin
    })
  },
  methods: {
    formatDate (date) {
      const time = new Date(date)
      return time.getFullYear() + ' 年 ' + (time.getMonth() + 1) + ' 月 ' + time.getDate() + ' 日'
    },

    submit () {
      if (!localStorage.getItem('token')) return alert('请先登录')
      const {postID, content, user_id} = this
      if (!content) return
      this.$http.post(comment_url, {
        post_id: postID,
        content, user_id,
      }).then(() => {
        this.content = ''
        this.updateCommentList()
      })
    },

    handleClickReplyBtn (index, replyed_id, replyed_user_id) {
      this.replyed_id = replyed_id
      this.replyed_user_id = replyed_user_id
      this.handleReplyShow(index)
    },

    handleReplyShow (index) {
      const data = this.commentList[index]
      data.replyShow = !data.replyShow
      this.commentList.splice(index, 1, data)
    },

    submitReply (index) {
      if (!localStorage.getItem('token')) return alert('请先登录')
      const {postID, replyContent, user_id, replyed_id, replyed_user_id} = this
      if (!replyContent) return
      this.$http.post(comment_url, {
        content: replyContent,
        post_id: postID,
        user_id, replyed_id, replyed_user_id,
      }).then(() => {
        this.replyContent = ''
        this.handleReplyShow(index)
        this.updateCommentList()
      })
    },

    updateCommentList () {
      this.$http.get(`${comment_url}/?post_id=${this.postID}`).then(resp => {
        const commentList = resp.data.filter(comment => {
          return !comment.replyed_id
        })
        commentList.forEach(comment => {
          comment.replys = resp.data.filter(reply => reply.replyed_id === comment._id)
        })
        this.commentList = commentList
      })
    },

    deleteComment (id) {
      this.$http.delete(`${comment_url}/${id}`).then(() => {
        this.updateCommentList()
      })
    }
  },
  watch: {
    postID () {
      this.updateCommentList()
    }
  }
}
</script>


<style scoped>
button {
  cursor: pointer;
}

p {
  color: #333;
  text-align: left;
}

ul {
  list-style: none;
}

.header p {
  color: #e46359;
  font-size: 25px;
}

.comment-list .title {
  font-weight: 500;
  font-size: 20px;
}

.comment-list li {
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 10px;
}

.comment-list .header {
  display: flex;
  flex-flow: row nowrap;
}

.comment-list .header .user {
  margin-left: 10px;
  width: 100%;
}

.comment-list .header button {
  border-style: none;
  outline: none;
  width: 50px;
  color: #e46359;
  font-size: 12px;
  font-weight: 500;
}

.comment-list .header p {
  margin: 0;
  font-size: 14px;
  height: 25px;
  line-height: 25px;
}

.comment-list .header .user .user-name {
  font-weight: 500;
}

.comment-list .header .user .comment-time {
  font-size: 12px;
  color: #999;
}

.comment-list li img {
  height: 50px;
  border-radius: 50%;
}

.comment-list li .content {
  color: #333;
  font-size: 15px;
  margin-left: 60px;
}

.comment-area {
  width: 100%;
  height: 100px;
  resize: none;
  color: #333;
  border: 2px solid;
  border-color: #ececec;
  outline: none;
  padding: 8px;
  border-radius: 5px;
}
.submit {
  width: 100%;
  outline: none;
  height: 48px;
  background-color: #333;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
}
</style>

