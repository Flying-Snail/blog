<template>
<nav class="nav">
  <div class="continer">
    <span class="logo" @click="showOrigin">LIN'S</span>

    <div class="nav-bar-collapse">
      <ul class="type-list">
        <li @click="showOrigin">首页</li>
        <li class="label-area">
          标签分类
          <nav class="labels">
            <li v-for="label in labels" :key="label._id" @click="showLabelPosts(label._id)"> {{label.name}} </li>
          </nav>
        </li>
        <li>关于</li>
        <li>留言板</li>
      </ul>

      <ul class="tool-list">
        <li class="search" :class="{'show-search': showSearch}">
          <i @click="handleShowSearch"></i>
          <input type="text" v-model="search" placeholder="搜索" @keydown.enter="showSearchPosts">
        </li>
        <li class="style">
          <i></i>
        </li>
        <li :class="{'login-btn': !hasLogin, 'logout-btn': hasLogin}" @click="handelLoginStatus('loginShow', !loginShow)">
          <i></i>
        </li>
      </ul>
    </div>
  </div>

  <!-- 登录 -->
  <div class="dialog" v-show="loginShow">
    <div class="login">
      <i @click="handelModel('loginShow', false)"></i>
      <input type="text" placeholder="用户名" v-model="userName">
      <input type="password" placeholder="密码" v-model="password">
      <div class="btn-area">
        <button @click="login"> 登录 </button>
        <button @click="handelModel('registerShow', true)">注册</button>
      </div>
    </div>
  </div>

  <!-- 注册 -->
  <div class="dialog" v-show="registerShow">
    <div class="register login">
      <i @click="handelModel('registerShow', false)"></i>
      <label for="avatar" class="avatar"></label>
      <input type="file" id="avatar" style="display: none;" @change="uploadImage">
      <input type="text" placeholder="用户名:6-16位英文数字" v-model="userName">
      <input type="text" placeholder="昵称:2-10位中英文" v-model="nickName">
      <input type="password" placeholder="密码:6-16位英文数字" v-model="password1">
      <input type="password" placeholder="再次输入密码" v-model="password2">
      <button @click="register"> 注册 </button>
    </div>
  </div>
</nav>
</template>

<script>
const labels_url = 'http://127.0.0.1:3333/admin/api/labels'
const image_url = 'http://127.0.0.1:3333/admin/upload/image'
const asset_url = 'http://images.blog:8002'
const register_url = 'http://127.0.0.1:3333/register'
const login_url = 'http://127.0.0.1:3333/login'

export default {
  data () {
    return {
      labels: [],
      showSearch: false,
      search: '',
      hasLogin: false,
      loginShow: false,
      registerShow: false,
      userName: '',
      nickName: '',
      password: '',
      password1: '',
      password2: '',
      avatar_id: '',
    }
  },
  created () {
    this.$http.get(labels_url).then(rep => {
      this.labels = rep.data
    })
    if (window.localStorage.getItem('token')) this.hasLogin = true
  },
  methods: {
    showLabelPosts (id) {
      this.$router.push({path: '/posts', query: {labelId: id}})
    },

    showOrigin() {
      this.$router.push('/')
    },

    handleShowSearch () {
      this.showSearch = !this.showSearch
    },

    showSearchPosts () {
      if (!this.search) return this.$router.push('/')
      this.$router.push({path:'/posts', query: { search: this.search }})
    },

    handelModel (modelName, value) {
      this.loginShow = false
      this.registerShow = false
      this[modelName] = value
    },

    handelLoginStatus (model, value) {
      if (this.hasLogin) return this.logout()
      this.handelModel(model, value)
    },

    login () {
      this.$http.post(login_url, {
        password: this.password,
        user_name: this.userName,
      }).then(resp => {
        if (!resp.data.user_data) throw new Error(resp.data.message)
        localStorage.setItem('token', resp.data.token)
        localStorage.setItem('nickName', resp.data.user_data.nick_name)
        this.nickName = resp.data.user_data.nick_name
        this.hasLogin = true
        this.handelModel('loginShow', false)
      }).catch(error => {
        alert(error)
      })
    },

    logout () {
      this.hasLogin = false
      this.nickName = ''
      localStorage.removeItem('token')
      localStorage.removeItem('nickName')
    },

    register () {
      if (!this.userName || !this.nickName || !this.password1 || !this.password2) alert('信息填写不完全')
      if (this.password1 !== this.password2) alert('两次密码不一致')
      if (this.userName.length > 16 || this.userName.length < 6) alert('用户名格式有误')
      if (this.password1.length > 16 || this.password1.length < 6) alert('密码格式有误')
      if (this.nickName.length > 10 || this.nickName.length < 2) alert('昵称格式有误')
      this.$http.post(register_url, {
        user_name: this.userName,
        password: this.password1,
        nick_name: this.nickName,
        avatar_id: this.avatar_id,
      }).then(res => {
        if (res.data.success) this.handelModel('loginShow', true)
      })
    },

    uploadImage (e) {
      const fileInputElement = e.target
      const imgData = new FormData()
      imgData.append("image", fileInputElement.files[0])
      this.$http({
        url: image_url,
        method: 'post',
        data: imgData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        const result = res.data
        const url = asset_url + result.file_path + '/' + result.file_name
        this.avatar_id = result._id
        const avatar = document.querySelector('.avatar')
        avatar.style['background-image'] = `url(${url})`
      }).catch(err => {
        console.log(err)
      })
    }
  },
}
</script>


<style scoped>
ul, li {
  margin: 0;
  padding: 0;
}

.nav {
  position: fixed;
  top: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-flow: row;
  height: 72px;
  width: 100%;
  padding: 16px;
  margin: auto;
  color: rgba(0, 0, 0, 0.9);
  background-color: rgba(255,255,255,0.97);
  box-shadow: rgba(0, 0, 0, 0.118) 0px 5px 5px -5px;
  z-index: 10;
}

.continer {
  width: 92%;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  padding: 0 16px;
  align-items: center;
}

.logo {
  flex-shrink: 0;
  display: block;
  padding: 0;
  margin-right: 16px;
  font-size: 20px;
  font-weight: 700;
  height: 40px;
  line-height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.nav-bar-collapse {
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  width: 100%;
}

.nav-bar-collapse ul {
  display: flex;
  list-style: none;
  height: 40px;
}

.nav-bar-collapse li {
  cursor: pointer;
}

.nav-bar-collapse .type-list li {
  padding: 0 8px;
  height: 40px;
  line-height: 40px;
}

.label-area {
  display: flex;
  position: relative;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: center;
}

.label-area::after {
  display: block;
  margin-left: 5px;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.label-area:hover .labels {
  opacity: 1;
  pointer-events: auto;
}

.label-area .labels {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 160px;
  background-color: #fff;
  padding: 8px 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.118) 0px 1px 5px 1px;
  text-align: left;
}

.label-area .labels li {
  padding: 4px 24px;
  line-height: 2;
}

.label-area .labels li:hover {
  background-color: #eee;
}

.tool-list li {
  width: 40px;
  height: 40px;
  margin: 0 4px;
  border-radius: 50%;
  transition: 0.3s ease all;
}

.tool-list li {
  border-radius: 20px;
  background-color: #f0f0f0;
  width: 40px;
  height: 40px;
}

.tool-list i {
  border-radius: 50%;
}

.tool-list i {
  display: block;
  width: 40px;
  height: 40px;
  background-size: 18px;
  background-position: center;
  background-repeat: no-repeat;
}

.tool-list .search {
  background-color: #f0f0f0;
  display: flex;
  overflow: hidden;
}

.tool-list .search i {
  flex-shrink: 0;
  background-image: url('../assets/search.svg');
}

.tool-list .search.show-search {
  width: 160px;
}

.tool-list .search.show-search input{
  width: 104px;
  outline: none;
  border-style: none;
  background: #f0f0f0;
}

.tool-list .search i:hover {
  background-color: #333;
  background-image: url('../assets/search-white.svg')
}

.tool-list .login-btn i {
  background-image: url('../assets/login.svg');
}

.tool-list .login-btn i:hover {
  background-color: #333;
  background-image: url('../assets/login-w.svg');
}

.tool-list .logout-btn i {
  background-image: url('../assets/logout.svg');
}

.tool-list .logout-btn i:hover {
  background-color: #333;
  background-image: url('../assets/logout-w.svg');
}

.tool-list .style i {
  background-image: url('../assets/bg-colors.svg');
}

.tool-list .style i:hover {
  background-color: #333;
  background-image: url('../assets/bg-colors-w.svg');
}

.dialog {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}

.login {
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 350px;
  height: 350px;
  padding: 60px 50px;
  border-radius: 5px;
  background: #fff;
}

.register {
  height: 500px;
  align-items: center;
  padding: 50px;
}

.login input {
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  line-height: 40px;
  padding: 0 30px 0 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login .btn-area {
  display: flex;
  flex-flow: row nowrap;
}

.login button {
  background-color: #569ef8;
  height: 40px;
  width: 100%;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.login i {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 20px;
  height: 20px;
  display: block;
  background: url('../assets/close-circle.svg');
  background-size: 100%;
  cursor: pointer;
}

.register label {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #ccc;
  cursor: pointer;
  background-size: 100%;
}
</style>