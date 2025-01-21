<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="queryParams.keyword" style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" @input="changeValue" />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button v-permission="'add-employee'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment===1">正式</span>
              <span v-else-if="row.formOfEmployment===2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column width="280px" label="操作">
            <template v-slot="{row}">

              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm title="确定删除这段内容吗?" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height:60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev,pager,next"
            :total="total"
            :current-pag="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <importExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <el-checkbox-group v-model="roleIds">
        <el-checkbox
          v-for="item in roleList"
          :key="item.id"
          :label="item.id"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEnableRoleList, assignRoles } from '@/api/employee'
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import { getEmployeeList, exportEmployee, delEmployee, getEmployeeDetail } from '@/api/employee'
import FileSaver from 'file-saver'
import importExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    importExcel
  },
  data() {
    return {
      depts: [],
      list: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      total: 0,
      showExcelDialog: false,
      showRoleDialog: false,
      roleList: [],
      roleIds: [],
      currentUSerId: null
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      // 递归方法 将列表转化成树形
      // let result = await getDepartment()
      this.depts = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id
      this.queryParams.page = 1
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    changeValue() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 400)
    },
    async exportEmployee() {
      const result = await exportEmployee()
      FileSaver.saveAs(result, '员工信息表.xlsx')
    },
    async confirmDel(id) {
      await delEmployee(id)
      this.$message.success('删除成功')
      if (this.list.length === 1 && this.queryParams.page > 1) {
        this.queryParams.page--
      }
      this.getEmployeeList()
    },
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      this.currentUserId = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog = true
    },
    async btnRoleOK() {
      await assignRoles({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
