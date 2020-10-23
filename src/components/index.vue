<template>
  <el-container class="allHeight">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png"
             class="logo">
        <span>环保岛</span>
      </div>
      <el-button type="info"
                 plain
                 @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggleBtn"
             @click="toggleNav"> ||| </div>
        <!-- 导航栏一 -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409BFF"
                 :unique-opened="true"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''"
                      v-for="item in menuList"
                      :key="item.id">
            <!-- 一级菜单的模板区域template -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 导航栏二 -->
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <template>
          <!-- Welcome 的路由占位符 -->
          <router-view></router-view>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 导航栏数据
      menuList: [],
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 左侧导航栏的伸缩状态
      isCollapse: false,
      // 当前激活状态
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 左侧导航栏点击toggle实现伸缩折叠效果
    toggleNav () {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.allHeight {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 8px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.logo {
  width: 50px;
  height: 50px;
}
.iconfont {
  margin-right: 10px;
}
.toggleBtn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>
