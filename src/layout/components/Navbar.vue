<template>
  <div class="navbar">
    <div style="height: 70px;width: 90%;margin: 0 auto;">
      <div class="left-menu">
        <el-menu
          :default-active="$route.name"
          background-color="#545C64"
          text-color="#ECECEC"
          active-text-color="#FFD04B"
          :collapse-transition="false"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item v-for="(route,index) in routes" :key="index" :index="route.children[0].name">{{ route.children[0].meta.title }}</el-menu-item>
        </el-menu>
      </div>
      <div class="right-menu">
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img :src="'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'+'?imageView2/1/w/80/h/80'" class="user-avatar" alt="头像">
            <i class="el-icon-caret-bottom" style="color: #ffffff;" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>
                设置
              </el-dropdown-item>
            </router-link>
            <router-link to="/login/index">
              <el-dropdown-item>
                登录
              </el-dropdown-item>
            </router-link>
            <router-link to="/register/index">
              <el-dropdown-item>
                注册
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: { },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    routes() {
      return this.$router.options.routes.filter(t => !t.hidden)
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({
        name: key
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #545C64;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.8);

  .breadcrumb-container {
    float: left;
  }

  .left-menu {
    float: left;
    height: 100%;
    line-height: 70px;
  }

  .el-menu--horizontal>.el-menu-item {
    height: 70px;
    line-height: 70px;
    font-size: 15px;
    font-weight: bold;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
