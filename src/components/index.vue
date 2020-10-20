<template>
  <div>
    <el-row>
      <el-button type="info"
                 plain
                 @click="logout">信息按钮</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
