<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 搜索框 -->
      <el-input placeholder="请输入内容"
                v-model="queryInfo.query"
                class="input-with-select"
                clearable
                @clear="getGoodsList">
        <!-- 搜索按钮 -->
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="getGoodsList"></el-button>
      </el-input>
      <el-button type="primary"
                 class="addGoods"
                 @click="goAddPage">添加商品</el-button>

      <!-- 表单 -->
      <el-table :data="goodsList"
                style="width: 100%"
                stripe
                border>

        <!-- 索引列 -->
        <el-table-column type="index"
                         label="#">
        </el-table-column>

        <!-- 商品名称 -->
        <el-table-column prop="goods_name"
                         label="商品名称"
                         width="650px">
        </el-table-column>

        <!-- 商品价格 -->
        <el-table-column prop="goods_price"
                         label="商品价格(元)">
        </el-table-column>

        <!-- 商品重量 -->
        <el-table-column prop="goods_weight"
                         label="商品重量">
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作"
                         width="120px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="removeGoodsInfo(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination @size-change="downPageSizeChange"
                     @current-change="clickCurrentPageChange"
                     :current-page="nowCurrentPage"
                     :page-sizes="[20, 40, 60, 80]"
                     :page-size="this.queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.total"
                     background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 搜索框输入的内容
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 20
      },
      // 现在当前的页面
      nowCurrentPage: 1,
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 下拉分页修改触发的事件
    async downPageSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      console.log(this.queryInfo.pagesize)
      this.getGoodsList()
    },
    // 点击横条分页表 显示的当前页码
    clickCurrentPageChange (newCurrentPage) {
      console.log(newCurrentPage)
      this.queryInfo.pagenum = newCurrentPage
      console.log(this.queryInfo.pagenum)
      this.getGoodsList()
    },
    // 删除信息
    async removeGoodsInfo (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('用户取消了删除操作！')
      const { data: res } = await this.$http.delete(`goods/${id}`)
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 350px;
}
.addGoods {
  margin-left: 15px;
}
</style>
