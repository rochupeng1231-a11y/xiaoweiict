<template>
  <div class="progress-list-view">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h2>进度日志</h2>
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon>
            提交日志
          </el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-select
          v-model="filters.projectId"
          placeholder="选择项目"
          clearable
          style="width: 200px"
          @change="loadLogs"
        >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.projectName"
            :value="project.id"
          />
        </el-select>

        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <!-- 进度日志列表 -->
    <el-card class="timeline-card">
      <el-timeline v-loading="loading">
        <el-timeline-item
          v-for="log in logs"
          :key="log.id"
          :timestamp="log.reportDate"
          placement="top"
          size="large"
        >
          <el-card>
            <div class="log-header">
              <el-tag type="primary" size="large">{{ log.stage }}</el-tag>
              <div class="log-meta">
                <span>{{ log.reporter?.realName }}</span>
                <span>{{ formatDateTime(log.createdAt) }}</span>
              </div>
            </div>

            <div class="log-content">
              {{ log.progressDesc }}
            </div>

            <div v-if="log.issues" class="log-issues">
              <el-icon color="#f56c6c"><Warning /></el-icon>
              <span>问题：{{ log.issues }}</span>
            </div>

            <div v-if="log.task" class="log-task">
              <el-tag size="small">关联任务：{{ log.task.title }}</el-tag>
            </div>

            <div class="log-actions">
              <el-button link type="primary" size="small" @click="viewLog(log)">
                查看详情
              </el-button>
              <el-button link type="primary" size="small" @click="editLog(log)">
                编辑
              </el-button>
              <el-button link type="danger" size="small" @click="deleteLog(log)">
                删除
              </el-button>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 创建/编辑日志对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑日志' : '提交日志'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="logFormRef"
        :model="logForm"
        :rules="logRules"
        label-width="100px"
      >
        <el-form-item label="项目" prop="projectId" v-if="!isEdit">
          <el-select v-model="logForm.projectId" placeholder="选择项目" style="width: 100%">
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.projectName"
              :value="project.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务" prop="taskId">
          <el-select v-model="logForm.taskId" placeholder="选择关联任务（可选）" clearable style="width: 100%">
            <el-option
              v-for="task in tasks"
              :key="task.id"
              :label="task.title"
              :value="task.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目阶段" prop="stage">
          <el-input v-model="logForm.stage" placeholder="例如：现场勘察、设备采购、系统测试" />
        </el-form-item>

        <el-form-item label="进度描述" prop="progressDesc">
          <el-input
            v-model="logForm.progressDesc"
            type="textarea"
            :rows="4"
            placeholder="请详细描述当前进度情况、完成的工作内容等"
          />
        </el-form-item>

        <el-form-item label="存在问题">
          <el-input
            v-model="logForm.issues"
            type="textarea"
            :rows="2"
            placeholder="如遇到问题，请记录（可选）"
          />
        </el-form-item>

        <el-form-item label="现场照片">
          <el-input v-model="logForm.photos" placeholder="照片URL（多个用逗号分隔，可选）" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitLog" :loading="submitting">
          {{ isEdit ? '更新' : '提交' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看日志详情对话框 -->
    <el-dialog v-model="detailVisible" title="日志详情" width="600px">
      <div v-if="currentLog">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="项目阶段" :span="2">
            <el-tag type="primary">{{ currentLog.stage }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="报告人">
            {{ currentLog.reporter?.realName }}
          </el-descriptions-item>
          <el-descriptions-item label="报告时间">
            {{ formatDateTime(currentLog.reportDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="关联任务" :span="2">
            <el-tag v-if="currentLog.task" size="small">
              {{ currentLog.task.title }}
            </el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div class="detail-section">
          <h4>进度描述</h4>
          <p>{{ currentLog.progressDesc }}</p>
        </div>

        <div v-if="currentLog.issues" class="detail-section">
          <h4>存在问题</h4>
          <p style="color: #f56c6c;">
            <el-icon><Warning /></el-icon>
            {{ currentLog.issues }}
          </p>
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button type="primary" @click="editLog(currentLog)">编辑</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { getProgressLogs, createProgressLog, updateProgressLog, deleteProgressLog, getTaskProgressLogs, type ProgressLog, type ProgressLogForm } from '@/api/progress'
import { getProjects } from '@/api/project'
import { getTasks } from '@/api/task'

const route = useRoute()

// 状态
const loading = ref(false)
const logs = ref<ProgressLog[]>([])
const projects = ref<any[]>([])
const tasks = ref<any[]>([])

const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

const logFormRef = ref()
const currentLog = ref<ProgressLog | null>(null)

// 筛选条件
const filters = reactive({
  projectId: route.query.projectId as string || ''
})

// 日志表单
const logForm = reactive<ProgressLogForm>({
  taskId: '',
  stage: '',
  progressDesc: '',
  issues: '',
  photos: ''
})

// 表单验证规则
const logRules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  stage: [{ required: true, message: '请输入项目阶段', trigger: 'blur' }],
  progressDesc: [{ required: true, message: '请输入进度描述', trigger: 'blur' }]
}

// 加载项目列表
const loadProjects = async () => {
  try {
    const { data } = await getProjects({})
    projects.value = data.data || []
    // 项目加载完成后，如果还没有选择项目，自动选择第一个
    if (!filters.projectId && projects.value.length > 0) {
      filters.projectId = projects.value[0].id
    }
  } catch (error) {
    ElMessage.error('加载项目列表失败')
  }
}

// 加载任务列表
const loadTasks = async (projectId: string) => {
  try {
    // 任务API返回: {success: true, data: [...]} 直接是数组
    const response = await getTasks(projectId)
    tasks.value = response.data || []
  } catch (error) {
    console.error('加载任务列表失败:', error)
  }
}

// 加载进度日志
const loadLogs = async () => {
  loading.value = true
  try {
    // 如果没有选择项目，不加载日志
    if (!filters.projectId) {
      logs.value = []
      loading.value = false
      return
    }

    // 进度日志API返回: {success: true, data: [...]} 直接是数组
    const response = await getProgressLogs(filters.projectId)
    logs.value = response.data || []

    // 加载该项目的任务列表
    await loadTasks(filters.projectId)
  } catch (error) {
    ElMessage.error('加载进度日志失败')
  } finally {
    loading.value = false
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  isEdit.value = false
  if (route.query.projectId) {
    filters.projectId = route.query.projectId as string
    logForm.projectId = route.query.projectId as string
    loadTasks(route.query.projectId as string)
  }
  dialogVisible.value = true
}

// 查看日志详情
const viewLog = (log: ProgressLog) => {
  currentLog.value = log
  detailVisible.value = true
}

// 编辑日志
const editLog = (log: ProgressLog) => {
  isEdit.value = true
  currentLog.value = log

  // 填充表单
  Object.assign(logForm, {
    taskId: log.taskId || '',
    stage: log.stage,
    progressDesc: log.progressDesc,
    issues: log.issues || '',
    photos: log.photos || ''
  })

  detailVisible.value = false
  dialogVisible.value = true
}

// 提交日志
const submitLog = async () => {
  try {
    await logFormRef.value.validate()
    submitting.value = true

    const projectId = logForm.projectId || filters.projectId

    // 清理空字符串
    const cleanData = {
      taskId: logForm.taskId || undefined,
      stage: logForm.stage,
      progressDesc: logForm.progressDesc,
      issues: logForm.issues || undefined,
      photos: logForm.photos || undefined
    }

    if (isEdit.value && currentLog.value) {
      await updateProgressLog(currentLog.value.id, cleanData)
      ElMessage.success('日志更新成功')
    } else {
      await createProgressLog(projectId, cleanData)
      ElMessage.success('日志提交成功')
    }

    dialogVisible.value = false
    loadLogs()
  } catch (error: any) {
    if (error?.response?.data?.error) {
      ElMessage.error(error.response.data.error)
    } else if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('操作失败')
    }
  } finally {
    submitting.value = false
  }
}

// 删除日志
const deleteLog = async (log: ProgressLog) => {
  try {
    await ElMessageBox.confirm('确定要删除这条日志吗？', '确认删除', {
      type: 'warning'
    })

    await deleteProgressLog(log.id)
    ElMessage.success('日志删除成功')
    loadLogs()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重置筛选
const resetFilters = () => {
  filters.projectId = ''
  logs.value = []
}

// 重置表单
const resetForm = () => {
  logFormRef.value?.resetFields()
  Object.assign(logForm, {
    taskId: '',
    stage: '',
    progressDesc: '',
    issues: '',
    photos: ''
  })
}

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 生命周期
onMounted(async () => {
  await loadProjects()
  loadLogs()
})
</script>

<style scoped>
.progress-list-view {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.timeline-card {
  min-height: 400px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.log-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #909399;
}

.log-content {
  margin-bottom: 12px;
  line-height: 1.6;
}

.log-issues {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f56c6c;
  margin-bottom: 8px;
  font-size: 14px;
}

.log-task {
  margin-bottom: 12px;
}

.log-actions {
  display: flex;
  gap: 12px;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h4 {
  margin-bottom: 8px;
  font-weight: 600;
}

.detail-section p {
  margin: 0;
  line-height: 1.6;
}
</style>
