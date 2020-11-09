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
                 @tab-click="clickFunction">
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

          <!-- 商品参数 -->
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTableData"
                          :key="item.attr_id">
              <el-checkbox v-model="item.attr_vals"
                           :label="items"
                           v-for="(items,index) in item.attr_vals"
                           :key="index"
                           border></el-checkbox>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane label="商品属性"
                       name="2">
            <!-- 商品名称 -->
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTableData"
                          :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <!-- 图片上传 -->
            <el-upload :action="uploadURL"
                       :on-preview="previewImgDialog"
                       :on-remove="uploadImgRemove"
                       list-type="picture"
                       :headers="headerObj"
                       :on-success="imgSuccessUpload">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip"
                   class="el-upload__tip">只能上传图片文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容"
                       name="4">
            <!-- 富文本编辑器 -->
            <quill-editor :v-model="addGoodsForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary"
                       class="addGoods"
                       @click="addGoodsBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览"
               :visible.sync="previewImgDialogVisiable"
               width="50%">
      <img :src="tempImgPreviewURL"
           style="width:100%;">
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="previewImgDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="previewImgDialogVisiable = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'

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
        goods_cat: [],
        pics: [],
        // 商品的详情页
        goods_introduce: ''
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
      cateAllInfooptions: { expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children' },
      // 保存商品参数的数组
      manyTableData: [],
      // 保存商品属性的数组
      onlyTableData: [],
      // upload上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 显示预览的Dialog框
      previewImgDialogVisiable: false,
      // upload组件的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片用的上的地址信息
      tempImgPreviewURL: ''
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
    },
    // 点击商品参数的时候 进行调用请求
    async clickFunction () {
      console.log(this.nowActiveStepIndex)
      if (this.nowActiveStepIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.manyTableData = res.data
        this.manyTableData.forEach(item => {
          item.attr_vals = item.attr_vals.lenth === 0 ? [] : item.attr_vals.split(' ')
        })
        console.log(this.manyTableData)
      }

      if (this.nowActiveStepIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    // 处理图片预览
    previewImgDialog (file) {
      this.previewImgDialogVisiable = true
      console.log(file)
      // 获取临时路径
      this.tempImgPreviewURL = file.response.data.url
      console.log(this.tempImgPreviewURL)
    },
    // 单击删除事件
    uploadImgRemove (file) {
      console.log('delete')
      console.log(file)
      // 1.获取将要删除的临时路径
      console.log(file.response.data.tmp_path)

      const filePath = file.response.data.tmp_path
      // 2.从数组中找到一样的
      const currentImg = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      console.log(currentImg)
      // 3.从数组中移除
      this.addGoodsForm.pics.splice(currentImg, 1)
      console.log(this.addGoodsForm.pics)
    },
    // 图片成功上传的路径
    imgSuccessUpload (response) {
      console.log(response)
      if (response.meta.status !== 200) return this.$message.error(response.meta.msg)
      this.$message.success(response.meta.msg)
      // 拼接字符串成为一个数组
      const pathInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(pathInfo)
      console.log(this.addGoodsForm.pics)
    },
    // 提交编辑的商品信息
    addGoodsBtn () {
      this.$refs.addGoodsRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('预校验失败，请重新输入！')
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 5px !important;
}
.addGoods {
  display: flex;
  margin-left: auto;
  margin-top: 25px;
}
</style>
