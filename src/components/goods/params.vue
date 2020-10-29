<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 警告框 -->
      <el-alert title="注意：只允许为第三级分类设置的相关参数！"
                type="warning"
                show-icon>
      </el-alert>

      <!-- 级联框 -->
      <el-row>
        <p>选择商品分类：
          <el-cascader v-model="selectedCateKeys"
                       :options="cateList"
                       :props="cateProps"
                       @change="cateChange"
                       class="eascaderWidth"
                       clearable></el-cascader>
        </p>
      </el-row>

      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName"
               @tab-click="tabClick">

        <!-- 动态参数 -->
        <el-tab-pane label="动态参数"
                     name="many">

          <!-- 添加参数 -->
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisable"
                     @click="addParams">添加参数</el-button>
          <!-- 动态参数的表格 -->
          <el-table :data="manyTableData"
                    style="width: 100%">

            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="closeTagInfo(index,scope.row)">{{item}}</el-tag>
                <!-- 点击添加 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>

            <!-- index序列 -->
            <el-table-column label="#"
                             type="index">
            </el-table-column>

            <!-- 参数名称 -->
            <el-table-column label="参数名称"
                             prop="attr_name">
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="editDialog(scope.row.attr_id)">修改</el-button>
                <!-- 删除 -->
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="deleteThisInfo(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性"
                     name="only">
          <!-- 添加属性 -->
          <el-button type="primary"
                     size="mini"
                     :disabled="isBtnDisable"
                     @click="addParams">{{currentDialogActiveName}}</el-button>

          <!-- 静态属性的表格 -->
          <el-table :data="onlyTableData"
                    style="width: 100%">

            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item,index) in scope.row.attr_vals"
                        :key="index"
                        closable
                        @close="closeTagInfo(index,scope.row)">{{item}}</el-tag>
                <!-- 点击添加 -->
                <el-input class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>

            <!-- index序列 -->
            <el-table-column label="#"
                             type="index">
            </el-table-column>

            <!-- 属性名称 -->
            <el-table-column label="属性名称"
                             prop="attr_name">
            </el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改 -->
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="editDialog(scope.row.attr_id)">修改</el-button>
                <!-- 删除 -->
                <el-button type="danger"
                           icon="el-icon-delete"
                           size="mini"
                           @click="deleteThisInfo(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

    <!-- 静态和动态 都能使用的Dialog -->
    <el-dialog :title="'添加'+currentDialogActiveName"
               :visible.sync="addDialogVisiable"
               width="50%"
               @close='closeAddDialog'>

      <!-- 表单 -->
      <el-form :model="addForm"
               :rules="addRules"
               ref="addRef"
               label-width="100px">

        <!-- form -->
        <el-form-item :label="currentDialogActiveName"
                      prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="addDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 静态和动态 都能使用【修改】的Dialog -->
    <el-dialog :title="'添加'+currentDialogActiveName"
               :visible.sync="editDialogVisiable"
               width="50%"
               @close="closeEditDialog">

      <!-- 表单 -->
      <el-form :model="editForm"
               :rules="editRules"
               ref="editRef"
               label-width="100px">

        <!-- form -->
        <el-form-item :label="currentDialogActiveName"
                      prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>

      </el-form>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditDialog">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品所有的分类
      cateList: [],
      // 级联器 模板
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      // 被激活的tabs页
      activeName: 'many',
      // 动态
      manyTableData: [],
      // 静态
      onlyTableData: [],
      // 添加参数的Dialog
      addDialogVisiable: false,
      // 表单
      addForm: {},
      // 规则：
      addRules: {
        attr_name: [{ required: true, message: '请输入参数名称！', triggle: 'blur' }]
      },
      // 修改Dialog的显示与隐藏
      editDialogVisiable: false,
      // 修改form
      editForm: {},
      // 修改的规则
      editRules: {
        attr_name: [{ required: true, message: '请输入参数名称！', triggle: 'blur' }]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 级联选择框 不选第三级的 就返回
    cateChange () {
      this.getParamsData()
    },
    // 标签页改变触发
    tabClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 抽离出来的那个参数列表
    async getParamsData () {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectedCateKeys)

      // 根据所选项 进行获取参数列表
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      // 获得数据的时候 进行attr_vals的数据修改 变成tag标签类
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })

      console.log(res.data)

      // 针对不同的动态参数 和静态属性进行判断
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 添加动态参数
    addParams () {
      this.addDialogVisiable = true
    },
    // 关闭添加的Dialog框
    closeAddDialog () {
      this.$refs.addRef.resetFields()
    },
    // Dialog对话框提交按钮
    submitAddDialog () {
      this.$refs.addRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.addDialogVisiable = false
      })
    },
    // 修改editDialog
    async editDialog (id) {
      console.log(id)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editForm = res.data

      this.getParamsData()
      this.editDialogVisiable = true
    },
    // 重置修改表单操作
    closeEditDialog () {
      this.$refs.editRef.resetFields()
    },
    // 提交修改表单
    submitEditDialog () {
      this.$refs.editRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialogVisiable = false
      })
    },
    // 删除信息
    async deleteThisInfo (id) {
      const confirmResult = await this.$confirm('此操作将删除信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('用户取消了删除操作！')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
      }
    },
    // tag标签中不管是因为enter键 还是 失去焦点都会触发该事件
    async handleInputConfirm (row) {
      console.log('ok')
      // 变成button的时候进行清空操作
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        // input输入框隐藏 变成button按钮
        row.inputVisible = false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },

    // 对attr_vals进行的操作
    async saveAttrVals (row) {
      // 发起请求保存到数据库内
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },

    // 点击tag标签的button按钮的时候 展示输入框
    showInput (row) {
      row.inputVisible = true
      // 自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 关闭tag标签触发事件
    async closeTagInfo (index, row) {
      console.log(index)
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${index}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }

  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisable () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中三级分类的ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 显示当前的Dialog名字
    currentDialogActiveName () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.eascaderWidth {
  width: 30%;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
