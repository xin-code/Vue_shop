<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList"
                stripe
                border
                style="width: 100%">

        <!-- index -->
        <el-table-column type="index"
                         label="#"></el-table-column>

        <!-- 权限名称 -->
        <el-table-column prop="authName"
                         label="权限名称"></el-table-column>

        <!-- 路径 -->
        <el-table-column prop="path"
                         label="路径"></el-table-column>

        <!-- 权限等级 -->
        <el-table-column prop="level"
                         label="权限等级">
          <!-- 对level等级进行美化 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 一级标签 -->
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <!-- 二级标签 -->
            <el-tag type="success"
                    v-else-if="scope.row.level==='1'">二级</el-tag>
            <!-- 三级标签 -->
            <el-tag type="warning"
                    v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
