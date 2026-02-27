<template>
  <div class="task-list-view">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <h2>任务管理</h2>
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon>
            新建任务
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
          @change="loadTasks"
        >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.projectName"
            :value="project.id"
          />
        </el-select>

        <el-select
          v-model="filters.status"
          placeholder="任务状态"
          clearable
          style="width: 150px"
          @change="loadTasks"
        >
          <el-option label="待开始" value="pending" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>

        <el-select
          v-model="filters.priority"
          placeholder="优先级"
          clearable
          style="width: 120px"
          @change="loadTasks"
        >
          <el-option label="高" value="high" />
          <el-option label="中" value="medium" />
          <el-option label="低" value="low" />
        </el-select>

        <el-button @click="resetFilters">重置</el-button>
      </div>
    </el-card>

    <!-- 任务列表 -->
    <el-card class="table-card">
      <el-table :data="tasks" v-loading="loading" border stripe>
        <el-table-column prop="title" label="任务标题" width="200" />

        <el-table-column prop="project.projectName" label="所属项目" width="150" />

        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="assignee.realName" label="分配给" width="100">
          <template #default="{ row }">
            {{ row.assignee?.realName || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="进度" width="150">
          <template #default="{ row }">
            <el-slider
              :model-value="row.progress"
              :format-tooltip="(val: number) => `${val}%`"
              @change="updateProgress(row)"
              :disabled="row.status === 'completed'"
            />
          </template>
        </el-table-column>

        <el-table-column prop="dueDate" label="截止日期" width="120">
          <template #default="{ row }">
            {{ row.dueDate ? formatDate(row.dueDate) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewTask(row)">
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="editTask(row)">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="deleteTask(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建/编辑任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑任务' : '新建任务'"
      width="600px"
      @close="resetForm"
    >
      <el-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="taskRules"
        label-width="100px"
      >
        <el-form-item label="项目" prop="projectId" v-if="!isEdit">
          <el-select v-model="taskForm.projectId" placeholder="选择项目" style="width: 100%">
            <el-option
              v-for="project in projects"
              :key="project.id"
              :label="project.projectName"
              :value="project.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务标题" prop="title">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>

        <el-form-item label="任务类型">
          <el-input v-model="taskForm.taskType" placeholder="例如：现场勘察" />
        </el-form-item>

        <el-form-item label="任务描述">
          <el-input
            v-model="taskForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="taskForm.priority">
            <el-radio-button value="high">高</el-radio-button>
            <el-radio-button value="medium">中</el-radio-button>
            <el-radio-button value="low">低</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="taskForm.status" style="width: 100%">
            <el-option label="待开始" value="pending" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="进度">
          <el-slider v-model="taskForm.progress" :marks="{ 0: '0%', 50: '50%', 100: '100%' }" />
        </el-form-item>

        <el-form-item label="分配给">
          <el-select v-model="taskForm.assigneeId" placeholder="选择人员" clearable style="width: 100%">
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.realName"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker
            v-model="taskForm.startDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="截止日期">
          <el-date-picker
            v-model="taskForm.dueDate"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTask" :loading="submitting">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看任务详情对话框 -->
    <el-dialog v-model="detailVisible" title="任务详情" width="600px">
      <div v-if="currentTask">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务标题">
            {{ currentTask.title }}
          </el-descriptions-item>
          <el-descriptions-item label="所属项目">
            {{ currentTask.project?.projectName }}
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(currentTask.priority)">
              {{ getPriorityText(currentTask.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentTask.status)">
              {{ getStatusText(currentTask.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="进度">
            {{ currentTask.progress }}%
          </el-descriptions-item>
          <el-descriptions-item label="分配给">
            {{ currentTask.assignee?.realName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="开始日期">
            {{ currentTask.startDate ? formatDate(currentTask.startDate) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="截止日期">
            {{ currentTask.dueDate ? formatDate(currentTask.dueDate) : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="任务类型" :span="2">
            {{ currentTask.taskType || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="2">
            {{ currentTask.description || '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <div style="margin-top: 20px; text-align: right;">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button type="primary" @click="editTask(currentTask)">编辑</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { getTasks, createTask, updateTask, updateTaskProgress, deleteTask, getMyTasks, type Task, type TaskForm } from '@/api/task'
import { getProjects } from '@/api/project'

const route = useRoute()

// 状态
const loading = ref(false)
const tasks = ref<Task[]>([])
const projects = ref<any[]>([])
const users = ref<any[]>([])

const dialogVisible = ref(false)
const detailVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

const taskFormRef = ref()
const currentTask = ref<Task | null>(null)

// 筛选条件
const filters = reactive({
  projectId: route.query.projectId as string || '',
  status: '',
  priority: ''
})

// 任务表单
const taskForm = reactive<TaskForm>({
  title: '',
  description: '',
  taskType: '',
  assigneeId: '',
  priority: 'medium',
  status: 'pending',
  startDate: '',
  dueDate: '',
  progress: 0
})

// 表单验证规则
const taskRules = {
  projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
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

// 加载用户列表
const loadUsers = async () => {
  // TODO: 从 API 获取用户列表
  users.value = [
    { id: 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb', realName: '系统管理员' }
  ]
}

// 加载任务列表
const loadTasks = async () => {
  loading.value = true
  try {
    if (!filters.projectId && projects.value.length > 0) {
      // 如果没有选择项目，默认选择第一个项目
      filters.projectId = projects.value[0].id
    }

    if (filters.projectId) {
      // 获取指定项目的任务
      // 任务API返回: {success: true, data: [...]} 直接是数组
      const response = await getTasks(filters.projectId)
      tasks.value = response.data || []
    } else {
      // 如果仍然没有项目，显示空列表
      tasks.value = []
    }
  } catch (error) {
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

// 打开创建对话框
const openCreateDialog = () => {
  isEdit.value = false
  if (route.query.projectId) {
    taskForm.projectId = route.query.projectId as string
  }
  dialogVisible.value = true
}

// 查看任务详情
const viewTask = (task: Task) => {
  currentTask.value = task
  detailVisible.value = true
}

// 编辑任务
const editTask = (task: Task) => {
  isEdit.value = true
  currentTask.value = task

  // 填充表单
  Object.assign(taskForm, {
    title: task.title,
    description: task.description || '',
    taskType: task.taskType || '',
    assigneeId: task.assigneeId || '',
    priority: task.priority,
    status: task.status,
    startDate: task.startDate ? task.startDate.split('T')[0] : '',
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    progress: task.progress
  })

  detailVisible.value = false
  dialogVisible.value = true
}

// 提交任务
const submitTask = async () => {
  try {
    await taskFormRef.value.validate()
    submitting.value = true

    // 清理空字符串，转为 undefined
    const cleanData: any = {
      title: taskForm.title,
      priority: taskForm.priority,
      status: taskForm.status,
      progress: taskForm.progress
    }

    // 只添加非空的可选字段
    if (taskForm.description) {
      cleanData.description = taskForm.description
    }
    if (taskForm.taskType) {
      cleanData.taskType = taskForm.taskType
    }
    if (taskForm.assigneeId) {
      cleanData.assigneeId = taskForm.assigneeId
    }
    // 处理日期字段：空字符串不发送，否则后端验证会失败
    if (taskForm.startDate && taskForm.startDate.trim() !== '') {
      cleanData.startDate = taskForm.startDate
    }
    if (taskForm.dueDate && taskForm.dueDate.trim() !== '') {
      cleanData.dueDate = taskForm.dueDate
    }

    console.log('=== 提交任务 ===')
    console.log('是否编辑:', isEdit.value)
    console.log('原始表单数据:', taskForm)
    console.log('清理后的数据:', cleanData)

    if (isEdit.value && currentTask.value) {
      console.log('调用 updateTask，ID:', currentTask.value.id)
      await updateTask(currentTask.value.id, cleanData)
      ElMessage.success('任务更新成功')
    } else {
      console.log('调用 createTask')
      await createTask(taskForm.projectId || route.query.projectId as string, cleanData)
      ElMessage.success('任务创建成功')
    }

    dialogVisible.value = false
    loadTasks()
  } catch (error: any) {
    console.error('提交任务错误:', error)
    console.error('错误响应:', error.response)
    if (error?.response?.data?.error) {
      ElMessage.error(error.response.data.error)
    } else if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  } finally {
    submitting.value = false
  }
}

// 更新进度
const updateProgress = async (task: Task) => {
  try {
    await updateTaskProgress(task.id, task.progress)
    ElMessage.success('进度更新成功')
    loadTasks()
  } catch (error) {
    ElMessage.error('进度更新失败')
  }
}

// 删除任务
const deleteTask = async (task: Task) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？', '确认删除', {
      type: 'warning'
    })

    await deleteTask(task.id)
    ElMessage.success('任务删除成功')
    loadTasks()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 重置筛选
const resetFilters = () => {
  filters.projectId = ''
  filters.status = ''
  filters.priority = ''
  loadTasks()
}

// 重置表单
const resetForm = () => {
  taskFormRef.value?.resetFields()
  Object.assign(taskForm, {
    title: '',
    description: '',
    taskType: '',
    assigneeId: '',
    priority: 'medium',
    status: 'pending',
    startDate: '',
    dueDate: '',
    progress: 0
  })
}

// 工具函数
const getPriorityType = (priority: string) => {
  const map: Record<string, any> = { high: 'danger', medium: 'warning', low: 'info' }
  return map[priority] || ''
}

const getPriorityText = (priority: string) => {
  const map: Record<string, string> = { high: '高', medium: '中', low: '低' }
  return map[priority] || priority
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || ''
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待开始',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const formatDate = (dateStr: string) => {
  return dateStr.split('T')[0]
}

// 生命周期
onMounted(async () => {
  await loadProjects()
  loadUsers()
  loadTasks()
})
</script>

<style scoped>
.task-list-view {
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

.table-card {
  min-height: 400px;
}
</style>
