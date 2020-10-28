<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList"
                stripe
                border
                style="width: 100%">

        <!-- 展开列操作 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children"
                    :key="item1.id"
                    :class="['expandRowBottomBorder',index1===0?'expandRowTopBorder':'']">
              <!-- 一级权限 -->
              <el-col :span="8">
                <el-tag>{{item1.authName}}</el-tag>
              </el-col>
            </el-row>
            <!-- 二级权限 -->
            <!-- <el-row v-for="item2 in item1.children"
                    :key="item2.id">
              <el-col :span="19">
                <el-tag type="success">{{item2.authName}}</el-tag>
              </el-col>
            </el-row> -->
            <pre>{{scope.row}}</pre>
          </template>
        </el-table-column>

        <!-- index -->
        <el-table-column type="index"
                         label="#"></el-table-column>

        <!-- 角色名称 -->
        <el-table-column prop="roleName"
                         label="角色名称"></el-table-column>

        <!-- 角色描述 -->
        <el-table-column prop="roleDesc"
                         label="角色描述"></el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作"
                         width="290px">
          <template slot-scope="scope">
            <el-row>
              <!-- {{scope.row.id}} -->
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="small"
                         @click="editRolesInfo(scope.row.id)">编辑</el-button>
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="small"
                         @click="deletRolesInfo(scope.row.id)">删除</el-button>
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="small">分配权限</el-button>
            </el-row>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 添加角色Dialog -->
    <el-dialog title="添加角色"
               :visible.sync="addRoleVisiable"
               width="50%"
               @close="resetAddRolesDialog">
      <!-- 添加角色表单 -->
      <el-form :model="addRolesForm"
               :rules="addRolesRules"
               ref="addRolesRef"
               label-width="100px">
        <!-- 角色名称 -->
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="resetAddRolesDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddRolesDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色信息Dialog -->
    <el-dialog title="编辑信息"
               :visible.sync="editRolesInfoVisiable"
               width="50%">
      <!-- 编辑信息的表单信息 -->
      <el-form :model="getRolesInfoByidForm"
               :rules="editRolesRules"
               ref="editRolesRef"
               label-width="100px"
               @close="resetEditRolesDialog">
        <!-- id -->
        <el-form-item label="ID">
          <el-input v-model="getRolesInfoByidForm.roleId"
                    disabled></el-input>
        </el-form-item>

        <!-- 角色名称 -->
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="getRolesInfoByidForm.roleName"></el-input>
        </el-form-item>

        <!-- 角色描述 -->
        <el-form-item label="角色描述"
                      prop="roleDesc">
          <el-input v-model="getRolesInfoByidForm.roleDesc"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="resetEditRolesDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditRolesDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 列表信息
      rolesList: [],
      // 显示添加角色Dialog
      addRoleVisiable: false,
      // 添加角色form
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色规则Rules
      addRolesRules: {
        roleName: [{ required: true, message: '请输入角色名称！' }],
        roleDesc: [{ required: true, message: '请输入角色描述！' }]
      },
      // 存储id查到的数据
      getRolesInfoByidForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      // 编辑用户信息Dialog
      editRolesInfoVisiable: false,
      // 编辑用户信息规则Rules
      editRolesRules: {
        roleName: [{ required: true, message: '请输入角色名称！' }],
        roleDesc: [{ required: true, message: '请输入角色描述！' }]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    // 点击添加用户按钮
    addRoles () {
      this.addRoleVisiable = true
    },
    // 重置添加角色的表单
    resetAddRolesDialog () {
      this.$refs.addRolesRef.resetFields()
      this.addRoleVisiable = false
    },
    // 提交添加角色的表单
    submitAddRolesDialog () {
      this.$refs.addRolesRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('预校验失败！')
        // this.$message.success('预校验成功！')
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res.meta)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
      this.addRoleVisiable = false
      this.getRolesList()
    },
    // 操作——根据ID获取到数据
    async editRolesInfo (id) {
      console.log(id)
      const { data: res } = await this.$http.get(`roles/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesInfoByidForm = res.data
      console.log(this.getRolesInfoByidForm)

      // 显示编辑按钮 把存储的信息放入到input内部
      this.editRolesInfoVisiable = true
    },
    // 重置编辑角色信息的表单
    resetEditRolesDialog () {
      this.$refs.editRolesRef.resetFields()
      this.editRolesInfoVisiable = false
    },
    // 提交编辑角色信息
    submitEditRolesDialog () {
      this.$refs.editRolesRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('预校验失败！')
        // this.$message.success('预校验成功！')
        const id = this.getRolesInfoByidForm.roleId
        const { data: res } = await this.$http.put(`roles/${id}`, this.getRolesInfoByidForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
      this.editRolesInfoVisiable = false
      this.getRolesList()
    },
    // 删除用户信息
    async deletRolesInfo (id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getRolesList()
      } else {
        this.$message.info('用户取消了删除操作！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 0;
}
.expandRowTopBorder {
  border-top: 1px solid #eee;
}
.expandRowBottomBorder {
  border-bottom: 1px solid #eee;
}
</style>
