<template>
  <div class="project-detail">
    <div class="page-header">
      <el-button @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>项目详情</h2>
      <el-button type="primary" @click="editMode = !editMode">
        {{ editMode ? '取消编辑' : '编辑' }}
      </el-button>
    </div>

    <el-card v-loading="loading">
      <template v-if="project">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="项目编号">{{ project.projectCode }}</el-descriptions-item>
          <el-descriptions-item label="电信编号">{{ project.telecomCode }}</el-descriptions-item>
          <el-descriptions-item label="项目名称">{{ project.projectName }}</el-descriptions-item>
          <el-descriptions-item label="客户名称">{{ project.customerName }}</el-descriptions-item>
          <el-descriptions-item label="项目类型">{{ project.projectType }}</el-descriptions-item>
          <el-descriptions-item label="项目地址">{{ project.projectAddress }}</el-descriptions-item>
          <el-descriptions-item label="合同金额">¥{{ project.contractAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="项目经理">{{ project.manager?.realName }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ formatDate(project.startDate) }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ formatDate(project.endDate) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(project.status)">
              {{ getStatusText(project.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(project.createdAt) }}</el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div v-if="project.description">
          <h3>项目描述</h3>
          <p>{{ project.description }}</p>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { http } from '@/api'
import dayjs from 'dayjs'

const route = useRoute()
const loading = ref(false)
const project = ref<any>(null)
const editMode = ref(false)

const loadProject = async () => {
  loading.value = true
  try {
    const res = await http.get(`/projects/${route.params.id}`)
    project.value = res.data
  } catch (error) {
    ElMessage.error('加载项目详情失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD')
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
  loadProject()
})
</script>

<style scoped>
.project-detail {
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
</style>
