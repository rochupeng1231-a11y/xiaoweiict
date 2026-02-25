<template>
  <div class="project-list">
    <div class="page-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="$router.push('/projects/create')">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.search" placeholder="搜索项目" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="待立项" value="pending" />
            <el-option label="需求调研" value="survey" />
            <el-option label="方案确认" value="proposal" />
            <el-option label="采购中" value="purchasing" />
            <el-option label="实施中" value="implementing" />
            <el-option label="待验收" value="acceptance" />
            <el-option label="已交付" value="delivered" />
            <el-option label="已结算" value="settled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadProjects">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table :data="projects" v-loading="loading" stripe>
        <el-table-column prop="projectCode" label="项目编号" width="130" />
        <el-table-column prop="telecomCode" label="电信编号" width="120" />
        <el-table-column prop="projectName" label="项目名称" min-width="200" />
        <el-table-column prop="customerName" label="客户名称" width="150" />
        <el-table-column prop="projectType" label="项目类型" width="120" />
        <el-table-column prop="contractAmount" label="合同金额" width="120">
          <template #default="{ row }">
            ¥{{ row.contractAmount?.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager.realName" label="项目经理" width="100" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewProject(row.id)">
              查看
            </el-button>
            <el-button link type="primary" @click="editProject(row.id)">
              编辑
            </el-button>
            <el-button link type="danger" @click="deleteProject(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadProjects"
          @current-change="loadProjects"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { http } from '@/api'

const router = useRouter()

const loading = ref(false)
const projects = ref<any[]>([])

const searchForm = reactive({
  search: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0
})

const loadProjects = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit
    }
    if (searchForm.search) params.search = searchForm.search
    if (searchForm.status) params.status = searchForm.status

    const res = await http.get('/projects', { params })
    projects.value = res.data.data
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.status = ''
  pagination.page = 1
  loadProjects()
}

const viewProject = (id: string) => {
  router.push(`/projects/${id}`)
}

const editProject = (id: string) => {
  router.push(`/projects/${id}`)
}

const deleteProject = (project: any) => {
  ElMessageBox.confirm(
    `确定要删除项目"${project.projectName}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await http.delete(`/projects/${project.id}`)
      ElMessage.success('删除成功')
      loadProjects()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    survey: 'warning',
    proposal: 'warning',
    purchasing: 'warning',
    implementing: 'primary',
    acceptance: 'success',
    delivered: 'success',
    settled: ''
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待立项',
    survey: '需求调研',
    proposal: '方案确认',
    purchasing: '采购中',
    implementing: '实施中',
    acceptance: '待验收',
    delivered: '已交付',
    settled: '已结算'
  }
  return map[status] || status
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
