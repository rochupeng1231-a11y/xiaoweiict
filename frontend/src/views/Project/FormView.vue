<template>
  <div class="project-form">
    <div class="page-header">
      <el-button @click="$router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h2>{{ isEdit ? '编辑项目' : '新建项目' }}</h2>
      <div></div>
    </div>

    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        v-loading="loading"
      >
        <!-- 项目编号 - 自动生成，新建时只读显示 -->
        <el-form-item label="项目编号" prop="projectCode">
          <el-input
            v-model="form.projectCode"
            :readonly="!isEdit"
            :placeholder="isEdit ? '项目编号' : '系统将自动生成项目编号'"
          >
            <template #suffix v-if="!isEdit">
              <el-icon style="cursor: help;"><InfoFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="电信编号" prop="telecomCode">
          <el-input v-model="form.telecomCode" placeholder="请输入电信编号" />
        </el-form-item>

        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>

        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>

        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="form.projectType" placeholder="请选择项目类型" style="width: 100%;">
            <el-option label="网络布线" value="网络布线" />
            <el-option label="安防监控" value="安防监控" />
            <el-option label="视频会议" value="视频会议" />
            <el-option label="云资源接入" value="云资源接入" />
            <el-option label="企业专线" value="企业专线" />
            <el-option label="弱电工程" value="弱电工程" />
          </el-select>
        </el-form-item>

        <!-- 项目地址 - 改为可选 -->
        <el-form-item label="项目地址">
          <el-input
            v-model="form.projectAddress"
            placeholder="选填，请输入项目地址"
            clearable
          />
        </el-form-item>

        <el-form-item label="合同金额" prop="contractAmount">
          <el-input-number
            v-model="form.contractAmount"
            :min="0"
            :precision="2"
            :step="1000"
            style="width: 100%"
            controls-position="right"
            placeholder="请输入合同金额"
          />
        </el-form-item>

        <!-- 开始日期 - 默认为今天 -->
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="选择开始日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
            :disabled-date="(date) => date < new Date()"
          />
        </el-form-item>

        <!-- 结束日期 - 移除 -->
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%;">
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

        <el-form-item label="项目描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入项目描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ submitting ? '提交中...' : '提交' }}
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { http } from '@/api'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  projectCode: '',
  telecomCode: '',
  projectName: '',
  customerName: '',
  projectType: '',
  projectAddress: '',
  contractAmount: 0,
  managerId: '',
  startDate: dayjs().format('YYYY-MM-DD'), // 默认为今天
  endDate: '',
  status: 'pending',
  description: ''
})

const rules: FormRules = {
  telecomCode: [{ required: true, message: '请输入电信编号', trigger: 'blur' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  contractAmount: [
    { required: true, message: '请输入合同金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '合同金额必须大于0', trigger: 'blur' }
  ],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }]
}

// 生成项目编号
const generateProjectCode = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `PRJ${year}${month}${day}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
}

const loadProject = async () => {
  if (!isEdit.value) return

  loading.value = true
  try {
    const res = await http.get(`/projects/${route.params.id}`)
    Object.assign(form, {
      projectCode: res.data.projectCode,
      telecomCode: res.data.telecomCode,
      projectName: res.data.projectName,
      customerName: res.data.customerName,
      projectType: res.data.projectType,
      projectAddress: res.data.projectAddress || '',
      contractAmount: res.data.contractAmount,
      managerId: res.data.managerId,
      startDate: res.data.startDate?.split('T')[0],
      endDate: res.data.endDate?.split('T')[0] || '',
      status: res.data.status,
      description: res.data.description || ''
    })
  } catch (error) {
    ElMessage.error('加载项目信息失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      // 新建项目时自动生成项目编号
      if (!isEdit.value && !form.projectCode) {
        form.projectCode = generateProjectCode()
      }

      // 使用当前用户ID作为managerId
      form.managerId = 'fd1bf517-c0e2-4755-9f2c-9d9b6fa32fcb'

      if (isEdit.value) {
        await http.put(`/projects/${route.params.id}`, form)
        ElMessage.success('更新成功')
      } else {
        await http.post('/projects', form)
        ElMessage.success(`创建成功，项目编号：${form.projectCode}`)
      }
      router.back()
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.error || (isEdit.value ? '更新失败' : '创建失败'))
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadProject()
})
</script>

<style scoped>
.project-form {
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

:deep(.el-input-number) {
  width: 100%;
}
</style>
