<template>
  <div>

    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <!-- 栅格—左 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 栅格—右 -->
        <el-col :span="4">
          <el-button type="primary"
                     @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList"
                stripe
                border
                style="width: 100%">

        <!-- index -->
        <el-table-column type="index"
                         label="#">
        </el-table-column>

        <!-- 姓名列 -->
        <el-table-column prop="username"
                         label="姓名"></el-table-column>

        <!-- 邮箱列 -->
        <el-table-column prop="email"
                         label="邮箱"></el-table-column>

        <!-- 电话列 -->
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>

        <!-- 角色列 -->
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>

        <!-- 状态列 -->
        <el-table-column prop="mg_state"
                         label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="switchChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作"
                         width="174px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->

            <!-- 修改 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="修改"
                        placement="top-start"
                        :enterable="false">
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="small"
                         @click="editUserInfo(scope.row.id)"></el-button>
            </el-tooltip>

            <!-- 删除 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="删除"
                        placement="top-start"
                        :enterable="false">
              <el-button type="danger"
                         icon="el-icon-delete"
                         size="small"
                         @click="deleteUserInfo(scope.row.id)"></el-button>
            </el-tooltip>

            <!-- 分配权限 -->
            <el-tooltip class="item"
                        effect="dark"
                        content="分配"
                        placement="top-start"
                        :enterable="false">
              <el-button type="warning"
                         icon="el-icon-setting"
                         size="small"
                         @click="setRolesRight(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="pageSizeChange"
                     @current-change="pageCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[ 1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisiable"
               width="50%"
               @close="resetAddUserForm">
      <!-- 表单区域 -->
      <el-form :model="addUserForm"
               :rules="addUserRules"
               ref="addUserRef"
               label-width="100px">
        <!-- 用户名 -->
        <el-form-item label="用户名:"
                      prop="username">
          <el-input v-model="addUserForm.username">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码:"
                      prop="password">
          <el-input v-model="addUserForm.password"
                    type="password"
                    show-password>
          </el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱:"
                      prop="email">
          <el-input v-model="addUserForm.email">
          </el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机:"
                      prop="mobile">
          <el-input v-model="addUserForm.mobile">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="resetAddUserForm">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改信息"
               :visible.sync="editUserInofVisiable"
               width="50%">
      <!-- 修改用户信息的表单 -->
      <el-form ref="editUserInfoRef"
               :rules="editUserInfoRules"
               :model="editUserInfoForm"
               label-width="80px">
        <!-- 用户名 禁止修改 -->
        <el-form-item label="用户名:"
                      prop="username">
          <el-input v-model="editUserInfoForm.username"
                    disabled></el-input>
        </el-form-item>
        <!-- 邮箱 可以修改 -->
        <el-form-item label="邮箱:"
                      prop="email">
          <el-input v-model="editUserInfoForm.email"></el-input>
        </el-form-item>
        <!-- 手机 可以修改 -->
        <el-form-item label="手机:"
                      prop="mobile">
          <el-input v-model="editUserInfoForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="resetEditUserInfo">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRolesdialogVisible"
               width="50%"
               @close="closeSetRoleDialog">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId"
                     placeholder="请选择">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.roleName"
                       :value="item.id">
            </el-option>
          </el-select>
        </p>

      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="setRolesdialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitSetRoles">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱规则 在return之前校验：
    var checkEmail = (rule, value, callback) => {
      // 正则表达式
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱地址！'))
    }

    // 验证手机号码规则 在return之前校验
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码！'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示的数据
        pagesize: 10
      },
      userList: [],
      total: 0,
      // 显示添加用户的对话框
      addDialogVisiable: false,
      // 显示修改用户信息的对话框
      editUserInofVisiable: false,
      // 添加用户的Form
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的Rules规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', triggle: blur },
          { min: 3, max: 7, message: '长度在3~7个字符！', triggle: blur }
        ],
        password: [
          { required: true, message: '请输入密码', triggle: blur },
          { min: 3, max: 7, message: '长度在3~7个字符！', triggle: blur }
        ],
        email: [
          { required: true, message: '请输入邮箱', triggle: blur },
          { validator: checkEmail, triggle: blur }
        ],
        mobile: [
          { required: true, message: '请输入手机号', triggle: blur },
          { validator: checkMobile, triggle: blur }
        ]
      },
      // 根据用户ID查询信息的Form
      editUserInfoForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户信息的规则
      editUserInfoRules: {
        email: [
          { required: true, message: '请输入邮箱', triggle: blur },
          { validator: checkEmail, triggle: blur }
        ],
        mobile: [
          { required: true, message: '请输入手机号', triggle: blur },
          { validator: checkMobile, triggle: blur }
        ]
      },
      // 显示分配角色的dialog
      setRolesdialogVisible: false,
      // 分配角色的对象
      userInfo: {},
      // 所有的角色列表
      rolesList: [],
      // 当前选中的角色
      selectedRoleId: ''
    }
  },
  created () {
    // 页面加载的时候调用函数
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 页面数据发生变化时
    pageSizeChange (newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前页面发生变化时
    pageCurrentChange (newNum) {
      console.log(newNum)
      this.queryInfo.pagenum = newNum
      this.getUserList()
    },
    // Switch改变的时候
    async switchChange (newScope) {
      console.log(newScope)
      const { data: res } = await this.$http.put(`users/${newScope.id}}/state/${newScope.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    },
    // 添加用户
    addUser () {
      this.addDialogVisiable = true
    },
    // 关闭添加用户的对话框时重置表单
    resetAddUserForm () {
      this.addDialogVisiable = false
      this.$refs.addUserRef.resetFields()
    },
    submitAddForm () {
      this.$refs.addUserRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('预校验失败！')
        // this.$message.success('预校验成功！')
        // 发起请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      })
      this.getUserList()
      this.addDialogVisiable = false
    },
    // 修改用户信息
    async editUserInfo (id) {
      console.log(id)
      const { data: res } = await this.$http.get(`users/${id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editUserInfoForm = res.data
      this.editUserInofVisiable = true
    },
    // 提交修改用户信息
    submitEditUserInfo () {
      this.$refs.editUserInfoRef.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('预校验失败！')
        // this.$message.success('预校验成功！')
        const { data: res } = await this.$http.put('users/' + this.editUserInfoForm.id, { email: this.editUserInfoForm.email, mobile: this.editUserInfoForm.mobile })
        console.log(res)
        if (res.meta.status !== 200) return this.$http.error(res.meta.msg)
        this.$http.success(res.meta.msg)
      })
      this.editUserInofVisiable = false
      this.getUserList()
      this.$message.success('更新用户信息成功！')
    },
    // 重置修改用户信息的表单
    resetEditUserInfo () {
      this.$refs.editUserInfoRef.resetFields()
      this.editUserInofVisiable = false
    },
    // 删除用户信息
    async deleteUserInfo (id) {
      console.log(id)
      const confirmResult = await this.$confirm('此操作将永久该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 分配权限
    async setRolesRight (userInfo) {
      this.userInfo = userInfo
      console.log(userInfo)
      // 获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rolesList = res.data

      this.setRolesdialogVisible = true
    },
    // 提交分配角色权限的确定按钮
    async submitSetRoles () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)

      this.getUserList()

      this.setRolesdialogVisible = false
    },
    // 关闭重置表单操作
    closeSetRoleDialog () {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>
