<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog=true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <!-- 开 1 关 0 -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>  {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <el-popconfirm title="确定删除这段内容吗?" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <el-dialog title="新增角色" width="500px" :visible.sync="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="showPermisssionDialog" title="分配权限">
      <el-tree
        ref="permTree"
        node-key="id"
        :data="permissionData"
        :props="{label:'name'}"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnPermissionOK">确定</el-button>
          <el-button size="mini" @click="showPermisssionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      showDialog: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称长度为2-10位', trigger: 'blur' }
        ],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '角色描述长度为2-10位', trigger: 'blur' }
        ]
      },
      showPermisssionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          description: item.description,
          state: item.state
        })
      })
    },
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('操作成功')
          this.showDialog = false
          this.getRoleList()
          this.btnCancel
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.description = row.description
      row.editRow.state = row.state
    },
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
      } else {
        this.$message.error('角色名称和角色描述不能为空')
      }
    },
    async confirmDel(id) {
      await delRole(id)
      this.$message.success('删除角色成功')
      if (this.list.lenth === 1) { this.pageParams.page-- }
      this.getRoleList()
    },
    async btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      this.showPermisssionDialog = true
    },
    async btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色权限分配成功')
      this.showPermisssionDialog = false
    }
  }
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>
