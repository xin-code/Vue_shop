<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- alert警告框 -->
      <el-alert title="添加商品信息"
                type="info"
                center
                :closable="false"
                show-icon>
      </el-alert>

      <!-- Step步骤条 -->
      <el-steps :space="200"
                :active="nowActiveStepIndex-0"
                align-center
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 左侧步骤条 -->
      <el-form :model="addGoodsForm"
               :rules="addGoodsRules"
               ref="addGoodsRef"
               label-width="100px"
               label-position="top">
        <el-tabs tab-position="left"
                 v-model="nowActiveStepIndex"
                 :before-leave="tabsChange"
                 @tab-click="tabClcked">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息"
                       name="0">

            <!-- 商品名称 -->
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格 -->
            <el-form-item label="商品价格"
                          prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品重量"
                          prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"
                        type="number"></el-input>
            </el-form-item>
            <!-- 商品数量 -->
            <el-form-item label="商品数量"
                          prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"
                        type="number"></el-input>
            </el-form-item>

            <!-- 商品分类 -->
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader v-model="addGoodsForm.goods_cat"
                           :options="cateList"
                           :props="cateAllInfooptions"
                           @change="checkedChange"></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数"
                       name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="2">商品图片</el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 当前激活的步骤条
      nowActiveStepIndex: '0',
      // 添加商品的数据
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 选中的商品数组
        goods_cat: []
      },
      // 添加商品的验证规则
      addGoodsRules: {
        goods_name: [{ required: true, message: '请输入商品名称！', triggle: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格！', triggle: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量！', triggle: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品重量！', triggle: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类！' }]
      },
      // 获取所有商品的分类options对应的数据源
      cateList: [],
      // 获取级联选择器的时候的options
      cateAllInfooptions: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择器的change事件
    checkedChange () {
      console.log(this.addGoodsForm.goods_cat)
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // tab标签页进行切换效果
    tabsChange (activeName, oldActiveName) {
      console.log('即将离开的标签页：' + oldActiveName)
      console.log('现在的标签页是：' + activeName)
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
