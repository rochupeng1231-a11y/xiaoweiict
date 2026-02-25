<template>
  <div class="dashboard">
    <h2 class="page-title">仪表盘</h2>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff;">
              <el-icon :size="30"><FolderOpened /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">项目总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a;">
              <el-icon :size="30"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.inProgress }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c;">
              <el-icon :size="30"><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c;">
              <el-icon :size="30"><SuccessFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>欢迎回来，{{ userStore.user?.realName }}！</span>
            </div>
          </template>
          <div class="welcome-content">
            <p>欢迎使用 ICT 项目管理系统。这里是您管理所有 ICT 项目的中心。</p>
            <p>您可以：</p>
            <ul>
              <li>查看和管理所有项目</li>
              <li>跟踪项目进度和状态</li>
              <li>管理项目的财务和采购信息</li>
              <li>查看任务和进度日志</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { http } from '@/api'

const userStore = useUserStore()

const stats = ref({
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0
})

const loadStats = async () => {
  try {
    const res = await http.get<{ data: typeof stats }>('/projects/stats')
    stats.value = res.data
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.content-row {
  margin-top: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.welcome-content {
  line-height: 1.8;
  color: #666;
}

.welcome-content ul {
  margin-top: 10px;
  padding-left: 20px;
}

.welcome-content li {
  margin-bottom: 5px;
}
</style>
