<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 添加按钮 -->
      <el-row>
        <el-button type="primary"
                   class="addCateories"
                   @click="addCategories">添加分类</el-button>
      </el-row>

      <!-- 表格 -->
      <tree-table :data="goodsList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  show-index
                  index-text="#"
                  border>

        <!-- 是否有效 -->
        <template slot="isok"
                  slot-scope="scope">
          <!-- {{scope.row}} -->
          <i v-if="scope.row.cat_deleted!=='true'"
             class="el-icon-success"
             style="color:lightgreen"></i>
          <i v-else
             class="el-icon-error"
             style="color:red"></i>
        </template>

        <!-- 排序 -->
        <template slot="order"
                  slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-tag size="mini"
                  v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini"
                  type="success"
                  v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini"
                  type="warning"
                  v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt"
                  slot-scope="scope">
          <!-- 操作 -->
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="editCategoriesDialog(scope.row)">编辑</el-button>
          <!-- 删除 -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="deleteEditCateInfo()">删除</el-button>
        </template>

      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="pageSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="this.goodsParams.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="5"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="this.total">
      </el-pagination>

    </el-card>

    <!-- 添加分类dialog -->
    <el-dialog title="添加分类"
               :visible.sync="addCategoriesdialogVisible"
               width="50%"
               @close="closeAddCategoriesDialog">
      <!-- form表单 -->
      <el-form :model="categoriesForm"
               :rules="categoriesRules"
               ref="categoriesRef"
               label-width="100px">

        <!-- 分类名称 -->
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="categoriesForm.cat_name"></el-input>
        </el-form-item>

        <!-- 分级类别 -->
        <el-form-item label="分级类别：">
          <el-cascader v-model="cascaderData"
                       :options="allCascaderList"
                       :props="cascaderProps"
                       @change="cascaderChange"
                       class="cascaderWidth"
                       clearable></el-cascader>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addCategoriesdialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑操作 -->
    <el-dialog title="修改分类"
               :visible.sync="editCategoriesDialogVisiable"
               width="50%">

      <!-- 表单 -->
      <el-form :model="editCategoriesForm"
               :rules="editCategoriesRules"
               ref="editCategoriesRef"
               label-width="100px">
        <!-- 分类名称 -->
        <el-form-item label="分类名称："
                      prop="cat_name">
          <el-input v-model="editCategoriesForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editCategoriesDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditCategories">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      // 商品数据列表参数
      goodsParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 定义列属性
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      // 添加分类的dialog显示
      addCategoriesdialogVisible: false,
      // 添加分类的表格数据
      categoriesForm: {
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类的等级，默认为1级分类
        cat_level: 0
      },
      categoriesRules: {
        cat_name:
          [{ required: true, message: '请输入分类名称！', trigger: 'blur' }]
      },
      // 获取到的cascader保存到数组内
      allCascaderList: [],
      // cascaderProps分级类别
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 将选中的值双向绑定到data中的cascaderData
      cascaderData: [],
      // 修改分类的Dialog
      editCategoriesDialogVisiable: false,
      // 编辑操作-form表单
      editCategoriesForm: {},
      // 编辑操作的时候-存储ID字段
      editGetCateIdSave: '',
      // 编辑操作的时候-存储name名字
      editGetCateNameSave: '',
      // 编辑操作-Rule规则
      editCategoriesRules: {
        cat_name:
          [{ required: true, message: '请输入分类名称！', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', { params: this.goodsParams })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res.data)
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 当下拉框页数发生变化时触发的(每页显示的列表数字)
    pageSizeChange (newNum) {
      console.log(newNum)
      this.goodsParams.pagesize = newNum
      this.getGoodsList()
    },
    // 页码条码发生变化触发的(新的页码)
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.goodsParams.pagenum = newPage
      this.getGoodsList()
    },
    // 添加分类dialog
    addCategories () {
      this.getCascaderList()
      this.addCategoriesdialogVisible = true
    },
    // 获得cascader级联选择器中的内容
    async getCascaderList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.allCascaderList = res.data
    },
    // 当级联选择器改变触发的事件
    cascaderChange () {
      console.log(this.cascaderData)
      if (this.cascaderData.length > 0) {
        this.categoriesForm.cat_pid = this.cascaderData[this.cascaderData.length - 1]
        this.categoriesForm.cat_level = this.cascaderData.length
      } else {
        this.categoriesForm.cat_pid = 0
        this.categoriesForm.cat_level = 0
      }
    },
    // 提交分类
    submitCate () {
      this.$refs.categoriesRef.validate(async valid => {
        if (!valid) return
        console.log(this.categoriesForm)
        // 添加分类操作
        const { data: res } = await this.$http.post('categories', this.categoriesForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)

        this.getGoodsList()
        this.addCategoriesdialogVisible = false
      })
    },
    // 关闭添加分类的Dialog清空表单操作
    closeAddCategoriesDialog () {
      this.$refs.categoriesRef.resetFields()
      this.cascaderData = []
      this.categoriesForm.cat_pid = 0
      this.categoriesForm.cat_level = 0
    },
    // 编辑商品分类的信息
    async editCategoriesDialog (row) {
      console.log(row)
      this.editGetCateIdSave = row.cat_id
      this.editGetCateNameSave = row.cat_name
      const { data: res } = await this.$http.get(`categories/${this.editGetCateIdSave}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editCategoriesForm = res.data
      console.log(this.editCategoriesForm)
      this.editCategoriesDialogVisiable = true
    },
    // 提交编辑信息 更新列表
    async submitEditCategories () {
      const { data: res } = await this.$http.put(`categories/${this.editGetCateIdSave}`, this.editCategoriesForm)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
      this.editCategoriesDialogVisiable = false
    },
    // 删除操作
    async deleteEditCateInfo () {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        this.$message.info('用户取消了删除操作！')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.editGetCateIdSave}`, this.editGetCateNameSave)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.addCateories {
  margin-bottom: 15px;
}
.cascaderWidth {
  width: 100%;
}
.el-cascader-menu {
  height: 100px;
}
</style>
